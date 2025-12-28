# == Schema Information
#
# Table name: players_match_results
#
#  id              :integer          not null, primary key
#  player_id       :integer
#  match_result_id :integer
#  player_status   :integer          default(0), not null
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
  # test "the truth" do
  #   assert true
  # end
end
