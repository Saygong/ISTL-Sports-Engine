# == Schema Information
#
# Table name: courts
#
#  id          :integer          not null, primary key
#  name        :string
#  description :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

require 'test_helper'

class CourtTest < ActiveSupport::TestCase
  test 'creation' do
    assert_nothing_raised do
      create :court
    end
  end
end
