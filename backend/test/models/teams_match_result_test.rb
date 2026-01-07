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

require 'test_helper'

class TeamsMatchResultTest < ActiveSupport::TestCase
  test 'creation' do
    assert_nothing_raised do
      create :teams_match_result
    end
  end
end
