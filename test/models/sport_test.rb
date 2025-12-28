# == Schema Information
#
# Table name: sports
#
#  id           :integer          not null, primary key
#  description  :string
#  variant_kind :integer          default(0), not null
#  format_kind  :integer          default(0), not null
#  gender       :integer          default(0), not null
#  min_age      :datetime
#  max_age      :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

require "test_helper"

class SportTest < ActiveSupport::TestCase
  test 'sport' do
    assert_nothing_raised do
      create :sport
    end
  end
end
