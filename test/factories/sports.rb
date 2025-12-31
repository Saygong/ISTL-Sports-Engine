# frozen_string_literal: true
# == Schema Information
#
# Table name: sports
#
#  id           :integer          not null, primary key
#  created_at   :datetime         not null
#  description  :string
#  format_kind  :integer          default(0), not null
#  updated_at   :datetime         not null
#  variant_kind :integer          default(0), not null
#

FactoryBot.define do
  factory :sport do
    variant_kind { Sport.variant_kinds.keys.sample }
    format_kind { Sport.format_kinds.keys.sample }
  end
end
