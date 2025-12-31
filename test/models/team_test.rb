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

require "test_helper"

class TeamTest < ActiveSupport::TestCase
  test 'creation' do
    assert_nothing_raised do
      create :team
    end
  end
end
