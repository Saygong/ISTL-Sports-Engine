# frozen_string_literal: true

module Types
  module Tournaments
    class TournamentSearchInput < Types::BaseInputObject
      argument :name, String, required: false
      argument :sport_id, ID, required: false
      argument :start_date, GraphQL::Types::ISO8601Date, required: false
    end
  end
end
