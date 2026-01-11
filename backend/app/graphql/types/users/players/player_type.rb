# frozen_string_literal: true

module Types
  module Users
    module Players
      class PlayerType < Types::BaseObject
        implements UserInterfaceType

        field :joinable_tournaments,
              [Tournaments::TournamentType],
              null: false

        def joinable_tournaments
          # TODO: Only player should see the joinable tournaments
          context[:current_user]
            .then { |player| Tournament.joinable_by(player) }
        end
      end
    end
  end
end
