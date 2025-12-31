# == Schema Information
#
# Table name: matches
#
#  id            :integer          not null, primary key
#  referee_id    :integer
#  tournament_id :integer
#  date          :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_matches_on_referee_id     (referee_id)
#  index_matches_on_tournament_id  (tournament_id)
#

require 'test_helper'

class MatchTest < ActiveSupport::TestCase
  test 'creation' do
    assert_nothing_raised do
      create :match
      create :match, referee: nil
    end
  end

  test 'result' do
    create(:match)
      .tap { it.match_result = create :match_result }
      .tap(&:save!)
      .then { |match| assert_not_nil match.match_result }
  end
end
