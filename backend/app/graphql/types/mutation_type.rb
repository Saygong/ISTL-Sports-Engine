# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    include Mutations::Users::Players::MutationFields
  end
end
