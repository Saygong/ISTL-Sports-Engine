# == Schema Information
#
# Table name: court_fields
#
#  id          :integer          not null, primary key
#  court_id    :integer
#  name        :string
#  description :string
#  surface     :integer          default(0), not null
#  max_seats   :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_court_fields_on_court_id  (court_id)
#

require 'test_helper'

class Court::FieldTest < ActiveSupport::TestCase
  test 'creation' do
    assert_nothing_raised do
      create :court_field
    end
  end
end
