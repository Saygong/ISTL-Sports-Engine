# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Used to enable authentication.
    field_class BaseAuthenticatedField

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    include Sports::Queries
    include Courts::Queries
    include Tournaments::Queries
    include Matches::Queries
    include Users::Queries
  end
end
