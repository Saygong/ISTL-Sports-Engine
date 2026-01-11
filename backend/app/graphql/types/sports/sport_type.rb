# frozen_string_literal: true

module Types
  module Sports
    class SportType < Types::BaseObject
      field :variant_kind, VariantKindEnumType, null: false
      field :description, String, null: true
    end
  end
end
