# frozen_string_literal: true

module Mutations
  module Users
    module Players
      class BookMatch < BaseMutation
        class BookMatchArgs < Types::BaseInputObject
          argument :match_id, GraphQL::Types::ID, required: true
        end

        argument :args, BookMatchArgs, required: true
        type Types::Users::Players::PlayerType

        def resolve args:
          context[:current_user]
            .tap do |player|
              ViewersMatch
                .find_or_create_by!(match: Match.find(args[:match_id]), viewer: player)
            end
        end
      end
    end
  end
end
