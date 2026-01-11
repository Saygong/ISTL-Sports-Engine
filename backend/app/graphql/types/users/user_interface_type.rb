# frozen_string_literal: true

module Types
  module Users
    module UserInterfaceType
      include Types::BaseInterface

      field :id, ID, null: false
      field :email, String, null: false
      field :data, GraphQL::Types::JSON, null: false
      field :first_name, String, null: false
      field :last_name, GraphQL::Types::JSON, null: false
      field :birthdate, GraphQL::Types::ISO8601Date, null: false
      field :gender, GenderEnumType, null: false
    end
  end
end
