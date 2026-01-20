# frozen_string_literal: true

module Types
  module Matches
    class MatchType < Types::BaseObject
      with_options null: false do
        field :id, GraphQL::Types::ID
        field :teams, [Teams::TeamType]
        field :tournament, Tournaments::TournamentType
        field :round, GraphQL::Types::Int
        field :date, GraphQL::Types::ISO8601DateTime
        field :field, Courts::Fields::FieldType
      end

      field :referee,
            Users::Referees::RefereeType,
            null: true

      field :viewers,
            [Users::Players::PlayerType],
            null: false

      field :winner,
            Teams::TeamType,
            null: true

      def winner
        object
          .match_result
          &.winner
      end
    end
  end
end
