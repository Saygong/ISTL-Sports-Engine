# frozen_string_literal: true

module Matches
  module Seeding
    class Bracket < ::Seeding::Base
      def seed? match
        # A match is eligible if it is currently "incomplete" (missing teams/players)
        return false if match.nil?
        return false unless Match.incomplete.find_by(id: match.id)

        true
      end

      def start_seed match
        # Populate the game with teams by identifying the winners of the prerequisite matches
        match
          .matches
          .map(&:match_result)
          .compact
          .map(&:winner)
          .then { |teams| match.update! teams: teams }
      end
    end
  end
end
