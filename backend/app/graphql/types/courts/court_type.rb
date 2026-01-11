# frozen_string_literal: true

module Types
  module Courts
    class CourtType < Types::BaseObject
      field :name, String, null: true
    end
  end
end
