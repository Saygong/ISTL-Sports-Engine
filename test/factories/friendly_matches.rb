# == Schema Information
#
# Table name: friendly_matches
#
#  id         :integer          not null, primary key
#  player_id  :integer
#  sport_id   :integer
#  field_id   :integer
#  date       :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_friendly_matches_on_field_id   (field_id)
#  index_friendly_matches_on_player_id  (player_id)
#  index_friendly_matches_on_sport_id   (sport_id)
#

FactoryBot.define do
  factory :friendly_match do
    association :field, factory: :field
    association :organized_by, factory: :user_player
    association :sport, factory: :sport
  end
end
