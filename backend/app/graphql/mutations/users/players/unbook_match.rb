# frozen_string_literal: true

module Mutations
  module Users
    module Players
      class UnbookMatch < BaseMutation
        class UnbookMatchArgs < Types::BaseInputObject
          argument :match_id, GraphQL::Types::ID, required: true
        end

        argument :args, UnbookMatchArgs, required: true
        type Types::Users::Players::PlayerType

        def resolve args:
          context[:current_user]
            .tap do |player|
              ViewersMatch
                .find_by(match: Match.find(args[:match_id]), viewer: player)
                &.then(&:destroy!)
            end
        end
      end
    end
  end
end
