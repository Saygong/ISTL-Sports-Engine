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

require 'test_helper'

class Match::ResultTest < ActiveSupport::TestCase
  test 'creation' do
    assert_nothing_raised do
      create :match_result
    end
  end
end
