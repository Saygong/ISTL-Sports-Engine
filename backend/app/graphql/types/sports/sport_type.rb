# frozen_string_literal: true

module Types
  module Sports
    class SportType < Types::BaseObject
      field :id, ID, null: false
      field :variant_kind, VariantKindEnumType, null: false
      field :description, String, null: true
    end
  end
end
