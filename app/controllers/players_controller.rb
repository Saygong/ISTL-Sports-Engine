# frozen_string_literal: true

class PlayersController < ApplicationController
  include Authentications::Player

  before_action :authenticate_user!

  require_player!

  # ...
  def show
    @sports = Sport.all

    # ...
    @tournaments = Tournament.filter_by name:       params[:name],
                                        sport_id:   params[:sport_id],
                                        start_date: params[:start_date]

    # ...
    @tournaments
      .joinable_by(current_user)
      .then do |joinable_tournaments|
        @eligibility_by_tournament_id = @tournaments
                                        .map { { it.id => joinable_tournaments.include?(it) } }
                                        .reduce(&:merge)
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

  def build_participants_by_match_id matches
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
