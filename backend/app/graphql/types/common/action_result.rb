# frozen_string_literal: true

module Types
  module Common
    class ActionResult < Types::BaseObject
      field :result, ActionResultEnumType, null: false
    end
  end
end
