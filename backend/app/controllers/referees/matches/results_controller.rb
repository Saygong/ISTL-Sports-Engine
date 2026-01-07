# frozen_string_literal: true

module Referees
  module Matches
    class ResultsController < ApplicationController
      include Authentications::Referee

      before_action :authenticate_user!
      require_referee!

      def new
        @match = Match.find(params[:match_id])

        @match
          .participants_by_match_id
          .values
          .reduce(&:merge)
          .transform_values { it.map { |p| "#{p.first_name} #{p.last_name}" } }
          .then { @participants = it }

        @match
          .teams
          .map { |team| [team.name, team.id] }
          .then { @winner_team_options = it }
      end

      def create
        [params[:match_result][:description],
         params[:winner_team_id]]
          .then do |description, team_id|
            Match
              .find(params[:match_id])
              .then do |match|
                winner = match
                         .teams
                         .find(team_id)
                         .then { TeamsMatchResult.new team_status: :winner, team: it }

                loser = match
                        .teams
                        .where
                        .not(id: team_id)
                        .first
                        .then { TeamsMatchResult.new team_status: :loser, team: it }

                Match::Result.create! match:               match,
                                      description:         description,
                                      teams_match_results: [winner, loser]
              end
          end

        # After creating the match result, redirect to the home page
        redirect_to referee_path
      end
    end
  end
end
