# == Schema Information
#
# Table name: teams
#
#  id            :integer          not null, primary key
#  tournament_id :integer
#  name          :string
#  composition   :integer          default(0), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_teams_on_tournament_id  (tournament_id)
#

require 'test_helper'

class TeamTest < ActiveSupport::TestCase
  test 'creation' do
    assert_nothing_raised do
      create :team
    end
  end

  test 'matches' do
    create(:match)
      .then do |match|
        create(:team)
          .tap { it.matches << match }
          .tap(&:save!)
          .then do |team|
            assert_includes team.matches, match
            assert_includes match.teams, team
          end
      end
  end

  test 'match results' do
    create(:match_result)
      .then do |match_result|
        create(:team)
          .tap { it.teams_match_results << build(:teams_match_result, match_result: match_result) }
          .tap(&:save!)
          .then do |team|
            assert_includes team.match_results, match_result
            assert_includes match_result.teams, team
          end
      end
  end
end
