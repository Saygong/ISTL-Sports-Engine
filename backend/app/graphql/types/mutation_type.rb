# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # Used to enable authentication.
    field_class BaseAuthenticatedField

    include Mutations::Users::MutationFields
    include Mutations::Users::Players::MutationFields
    include Mutations::Users::Referees::MutationFields
  end
end
