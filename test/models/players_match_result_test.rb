# == Schema Information
#
# Table name: players_match_results
#
#  id              :integer          not null, primary key
#  player_id       :integer
#  match_result_id :integer
#  player_status   :integer          not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_players_match_results_on_match_result_id  (match_result_id)
#  index_players_match_results_on_player_id        (player_id)
#

require 'test_helper'

class PlayersMatchResultTest < ActiveSupport::TestCase
  test 'creation' do
    assert_nothing_raised do
      create :players_match_result
    end
  end
end
