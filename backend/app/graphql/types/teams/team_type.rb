# frozen_string_literal: true

module Types
  module Teams
    class TeamType < Types::BaseObject
      field :id, GraphQL::Types::ID, null: false
      field :composition, Common::CompositionEnumType, null: false
    end
  end
end
