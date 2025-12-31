# frozen_string_literal: true

# == Schema Information
#
# Table name: teams_match_results
#
#  id              :integer          not null, primary key
#  team_id         :integer
#  match_result_id :integer
#  team_status     :integer          not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_teams_match_results_on_match_result_id  (match_result_id)
#  index_teams_match_results_on_team_id          (team_id)
#
class TeamsMatchResult < ApplicationRecord
  belongs_to :match_result, class_name: 'Match::Result', inverse_of: :teams_match_results
  belongs_to :team

  enum :team_status, {
    winner: 0,
    loser:  1
  }

  validates :team_status, presence: true
end
