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

    has_many :players_match_results, dependent: :destroy, inverse_of: :match_result
    has_many :players, through: :players_match_results

    { won_by: :winner, lost_by: :loser }.each do |key, value|
      scope key, lambda { |player|
        joins(:players_match_results)
          .where(players_match_results: { player: player })
          .where(players_match_results: { player_status: value })
      }
    end
  end
end
