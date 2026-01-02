# frozen_string_literal: true

class PlayersController < ApplicationController
  include Authentications::Player

  before_action :authenticate_user!
  require_player! only: [:show]

  # GET /player
  def show
    @sports = Sport.all

    scope = Tournament.all.order(start_date: :asc)

    scope = scope.where("tournaments.name ILIKE ?", "%#{params[:name]}%") if params[:name].present?
    scope = scope.where(sport_id: params[:sport_id]) if params[:sport_id].present?

    if params[:start_date].present?
      # treat it as "same day"
      day = Date.parse(params[:start_date]) rescue nil
      scope = scope.where(start_date: day.beginning_of_day..day.end_of_day) if day
    end

    @tournaments = scope

    @eligibility_by_tournament_id = @tournaments.index_with do |t|
      eligible_for_tournament?(t, current_user)
    end
  end

  # GET /player/registrations
  # Matches where the current player is one of the participants (must play)
  def registrations
    @matches =
      Match
        .joins(teams: :players_teams)
        .where(players_teams: { player_id: current_user.id })
        .distinct
        .includes(tournament: [:sport, :court, :organizer], teams: :players)
        .order(date: :asc, round: :asc)

    @participants_by_match_id = build_participants_by_match_id(@matches)
  end

  def profile
    redirect_to profile_user_path
  end


  private

  def build_participants_by_match_id(matches)
    matches.index_with do |m|
      teams = m.teams.to_a
      left_players  = teams[0]&.players.to_a
      right_players = teams[1]&.players.to_a

      {
        left:  left_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" },
        right: right_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }
      }
    end
  end
end
