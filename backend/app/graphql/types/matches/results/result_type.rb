# frozen_string_literal: true

module Types
  module Matches
    module Results
      class ResultType < Types::BaseObject
        field :id, GraphQL::Types::ID, null: false
        field :description, GraphQL::Types::String, null: true
      end
    end
  end
end
