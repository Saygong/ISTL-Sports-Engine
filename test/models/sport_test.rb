# == Schema Information
#
# Table name: sports
#
#  id           :integer          not null, primary key
#  created_at   :datetime         not null
#  description  :string
#  format_kind  :integer          default(0), not null
#  gender       :integer          default(0), not null
#  updated_at   :datetime         not null
#  variant_kind :integer          default(0), not null
#  min_age      :integer
#  max_age      :integer
#

require "test_helper"

class SportTest < ActiveSupport::TestCase
  test 'sport' do
    assert_nothing_raised do
      create :sport
    end
  end
end
