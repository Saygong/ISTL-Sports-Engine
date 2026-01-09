# frozen_string_literal: true

module Players
  class TournamentsController < ApplicationController
    include Authentications::Player

    before_action :authenticate_user!
    require_player!

    # ...
    def show
      @tournament = Tournament.find(params[:id])

      @matches = @tournament
                   .matches
                   .order(:round, :date)

      # ...
      @eligible = Tournament
                    .joinable_by(current_user)
                    .where(id: params[:id])
                    .exists?

      # ...
      @is_registered = Tournament
                         .joined_by(current_user)
                         .where(id: params[:id])
                         .exists?

      # ...
      @booked_match_ids = current_user
                            .viewed_matches
                            .map(&:id)

      @participants_by_match_id = build_participants_by_match_id(@matches)
      @round_by_match_id = @matches.index_with { |m| m.round.present? ? "Round #{m.round}" : '—' }

      @joinable_teams =
        @tournament
          .teams
          .joinable_by(current_user)
    end

    # Manages the logic behind a player joining a specific tournament. Ensures that the user can actually participate in
    # the tournament before performing the action.
    def join
      Tournament
        .joinable_by(current_user)
        .find(params[:id])
        .tap { current_user.join! it, team_id: params[:team_id] }
        .then do |tournament|
        redirect_to player_tournament_path(tournament),
                    notice: I18n.t('notices.controllers.players.tournaments.join')
      end
    end

    private

    def build_participants_by_match_id matches
      matches.map do |m|
        # two “sides” from the teams; format as initials + last name
        teams = m.teams.to_a

        left_players  = teams[0]&.players.to_a
        right_players = teams[1]&.players.to_a

        {
          m.id => {
            left:  left_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" },
            right: right_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }
          }
        }

      end.reduce({}, :merge)
    end
  end
end