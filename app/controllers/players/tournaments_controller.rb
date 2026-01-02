# frozen_string_literal: true

module Players
  class TournamentsController < ApplicationController
    include Authentications::Player

    before_action :authenticate_user!
    before_action :require_player!
    before_action :set_tournament

    # GET /player/tournaments/:id
    def show
      @tournament = Tournament.find(params[:id])
      @matches = @tournament.matches
                            .includes(:referee, { teams: :players }, :viewers)
                            .order(:round, :date)
      @eligible = eligible_for_tournament?(@tournament, current_user)
      @is_individual = @tournament.single?
      # OLD @is_registered = current_user.joined? @tournament
      @is_registered = already_registered_in_tournament?
      @booked_match_ids = current_user.viewers_matches.where(match_id: @matches.map(&:id)).pluck(:match_id).to_set
      @participants_by_match_id = build_participants_by_match_id(@matches)
      @round_by_match_id = @matches.index_with { |m| m.round.present? ? "Round #{m.round}" : '—' }

      # @teams = @tournament.teams.includes(:players).order(:id)
    end

    # POST /player/tournaments/:tournament_id/join
    def join
      unless eligible_for_tournament?(@tournament, current_user)
        redirect_to player_tournament_path(@tournament), alert: 'You are not eligible for this tournament.'
        return
      end

      # TODO: implement your real subscription/registration creation here
      # PlayersTournament.subscribe(current_user, @tournament.id)

      if already_registered_in_tournament?
        redirect_to player_tournament_path(@tournament), notice: 'You are already registered.'
        return
      end

      if @tournament.single?
        join_single_tournament!
      else
        join_double_tournament!
      end

      redirect_to player_tournament_path(@tournament), notice: 'Registration completed.'
    rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotFound => e
      redirect_to player_tournament_path(@tournament), alert: e.message
    end

    private

    def set_tournament
      @tournament = Tournament.includes(:sport, :court, :organizer).find(params[:id] || params[:tournament_id])
    end

    def already_registered_in_tournament?
      PlayersTeam.joins(:team)
                 .where(player_id: current_user.id, teams: { tournament_id: @tournament.id })
                 .exists?
    end

    def join_single_tournament!
      team =
        @tournament.teams
                   .where(composition: :single)
                   .left_joins(:players_teams)
                   .group('teams.id')
                   .having('COUNT(players_teams.id) < 1')
                   .first

      team ||= @tournament.teams.create!(composition: :single, name: "Player #{current_user.id}")

      PlayersTeam.create!(player: current_user, team: team)
    end

    def join_double_tournament!
      team_id = params[:team_id].presence
      raise ActiveRecord::RecordNotFound, 'Please select a team.' if team_id.blank?

      team = @tournament.teams.find(team_id)

      raise ActiveRecord::RecordInvalid, 'This team is for singles.' if team.single?

      raise ActiveRecord::RecordInvalid, 'This team is already full.' if team.players.count >= 2

      PlayersTeam.create!(player: current_user, team: team)
    end

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
end
