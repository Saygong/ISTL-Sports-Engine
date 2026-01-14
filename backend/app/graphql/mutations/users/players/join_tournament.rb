# frozen_string_literal: true

module Mutations
  module Users
    module Players
      class JoinTournament < BaseMutation
        class JoinTournamentArgs < Types::BaseInputObject
          argument :tournament_id, GraphQL::Types::ID, required: true
          argument :team_id, GraphQL::Types::ID, required: false
        end

        argument :input, JoinTournamentArgs, required: true
        type Types::Users::Players::PlayerType

        def resolve tournament_id:, team_id:
          context[:current_user]
            .then do |player|
              Tournament
                .joinable_by(player)
                .find(tournament_id)
                .tap { player.join! it, team_id: team_id }
                .then { User::Player.find(player.id) }
            end
        end
      end
    end
  end
end
