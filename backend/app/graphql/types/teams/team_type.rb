# frozen_string_literal: true

module Types
  module Teams
    class TeamType < Types::BaseObject
      field :id, GraphQL::Types::ID, null: false
      field :name, GraphQL::Types::String, null: true
      field :composition, Common::CompositionEnumType, null: false
      field :players, [Users::Players::PlayerType], null: false
    end
  end
end
