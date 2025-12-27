# frozen_string_literal: true

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

FactoryBot.define do
  factory :sport do
    variant_kind { Sport.variant_kinds.keys.sample }
    format_kind { Sport.format_kinds.keys.sample }
    gender { Sport.genders.keys.sample }
  end
end
