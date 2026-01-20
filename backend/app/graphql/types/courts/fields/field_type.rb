# frozen_string_literal: true

module Types
  module Courts
    module Fields
      class FieldType < Types::BaseObject
        field :id, GraphQL::Types::ID, null: false
        field :name, GraphQL::Types::String, null: true
        field :description, GraphQL::Types::String, null: true
        field :max_seats, GraphQL::Types::Int, null: true
        field :court, Types::Courts::CourtType, null: false
        field :matches, [Matches::MatchType], null: false
      end
    end
  end
end
