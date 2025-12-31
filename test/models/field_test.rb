# == Schema Information
#
# Table name: fields
#
#  id          :integer          not null, primary key
#  name        :string
#  description :string
#  surface     :integer          default(0), not null
#  max_seats   :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

require 'test_helper'

class FieldTest < ActiveSupport::TestCase
  test 'creation' do
    assert_nothing_raised do
      create :field
    end
  end
end
