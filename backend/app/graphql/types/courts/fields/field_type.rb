# frozen_string_literal: true

module Types
  module Courts
    module Fields
      class FieldType < Types::BaseObject
        field :id, GraphQL::Types::ID, null: false
      end
    end
  end
end
