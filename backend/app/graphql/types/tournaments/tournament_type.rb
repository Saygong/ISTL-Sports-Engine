# frozen_string_literal: true

module Types
  module Tournaments
    class TournamentType < Types::BaseObject
      field :id, ID, null: false
      field :name, String, null: true
      field :min_age, Int, null: false
      field :max_age, Int, null: false
      field :number_of_matches, Int, null: false
      field :gender, GenderEnumType, null: false
      field :composition, CompositionEnumType, null: false
      field :start_date, GraphQL::Types::ISO8601Date, null: false

      field :organizer, Users::Organizers::OrganizerType, null: false
      field :court, Types::Courts::CourtType, null: false
      field :sport, Sports::SportType, null: false
    end
  end
end
