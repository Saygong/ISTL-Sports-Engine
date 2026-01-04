# frozen_string_literal: true

# == Schema Information
#
# Table name: match_results
#
#  id          :integer          not null, primary key
#  match_id    :integer
#  description :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_match_results_on_match_id  (match_id)
#
class Match
  class Result < ApplicationRecord
    belongs_to :match

    has_many :teams_match_results, dependent: :destroy, inverse_of: :match_result
    has_many :teams, through: :teams_match_results

    # Retrieve the winner for this result
    def winner
      teams_match_results
        .winner
        .first!
        .sole
    end

    { won_by: :winner, lost_by: :loser }.each do |key, value|
      scope key, lambda { |player|
        joins(teams_match_results: { team: :players })
          .where(players: { id: player.id })
          .where(teams_match_results: { team_status: value })
      }
    end
  end
end
