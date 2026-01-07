# == Schema Information
#
# Table name: matches
#
#  id             :integer          not null, primary key
#  court_field_id :integer
#  created_at     :datetime         not null
#  date           :datetime
#  referee_id     :integer
#  round          :integer
#  tournament_id  :integer
#  updated_at     :datetime         not null
#  match_id       :integer
#
# Indexes
#
#  index_matches_on_court_field_id  (court_field_id)
#  index_matches_on_match_id        (match_id)
#  index_matches_on_referee_id      (referee_id)
#  index_matches_on_tournament_id   (tournament_id)
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
