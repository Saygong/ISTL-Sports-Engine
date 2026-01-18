# frozen_string_literal: true

module Types
  module Courts
    class CourtType < Types::BaseObject
      field :id, GraphQL::Types::ID, null: false
      field :name, GraphQL::Types::String, null: true
    end
  end
end
