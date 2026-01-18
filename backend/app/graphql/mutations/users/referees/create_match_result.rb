# frozen_string_literal: true

module Mutations
  module Users
    module Referees
      class CreateMatchResult < BaseMutation
        class CreateMatchResultArgs < Types::BaseInputObject
          argument :description, GraphQL::Types::String, required: true
          argument :team_id, GraphQL::Types::ID, required: true
          argument :match_id, GraphQL::Types::ID, required: true
        end

        argument :args, CreateMatchResultArgs, required: true
        type Types::Users::Referees::RefereeType

        def resolve args:
          context[:current_user]
            .tap do |referee|
              Match
                .where(referee: referee)
                .find(args[:match_id])
                .then do |match|
                  winner = match
                           .teams
                           .find(args[:team_id])
                           .then { TeamsMatchResult.new team_status: :winner, team: it }

                  loser = match
                          .teams
                          .where
                          .not(id: args[:team_id])
                          .sole
                          .then { TeamsMatchResult.new team_status: :loser, team: it }

                  Match::Result.create! match:               match,
                                        description:         args[:description],
                                        teams_match_results: [winner, loser]
                end
            end
        end
      end
    end
  end
end
