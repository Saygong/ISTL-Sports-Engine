# == Schema Information
#
# Table name: matches
#
#  id            :integer          not null, primary key
#  tournament_id :integer
#  start_at      :datetime
#  end_at        :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_matches_on_tournament_id  (tournament_id)
#

require 'test_helper'

class MatchTest < ActiveSupport::TestCase
  test 'with result' do
    [create_match, create_referee].then do |match, referee|
      create(:match_result, match: match, referee: referee)
        .then do |result|
          assert_equal match.result, result
          assert_equal result.match, match
        end
    end
  end
end
