# frozen_string_literal: true

module Types
  module Tournaments
    class TournamentType < Types::BaseObject
      field :id, GraphQL::Types::ID, null: false
      field :name, GraphQL::Types::String, null: true
      field :min_age, GraphQL::Types::Int, null: false
      field :max_age, GraphQL::Types::Int, null: false
      field :number_of_matches, GraphQL::Types::Int, null: false
      field :gender, Common::GenderEnumType, null: false
      field :composition, Common::CompositionEnumType, null: false
      field :start_date, GraphQL::Types::ISO8601Date, null: false

      field :organizer, Users::Organizers::OrganizerType, null: false
      field :court, Courts::CourtType, null: false
      field :sport, Sports::SportType, null: false
      field :matches, [Matches::MatchType], null: false
      field :teams, [Teams::TeamType], null: false
    end
  end
end
