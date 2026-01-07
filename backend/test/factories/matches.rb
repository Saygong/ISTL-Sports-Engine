# == Schema Information
#
# Table name: matches
#
#  id             :integer          not null, primary key
#  court_field_id :integer
#  created_at     :datetime         not null
#  date           :datetime
#  referee_id     :integer
#  round          :integer
#  tournament_id  :integer
#  updated_at     :datetime         not null
#  match_id       :integer
#
# Indexes
#
#  index_matches_on_court_field_id  (court_field_id)
#  index_matches_on_match_id        (match_id)
#  index_matches_on_referee_id      (referee_id)
#  index_matches_on_tournament_id   (tournament_id)
#

FactoryBot.define do
  factory :match do
    association :tournament, factory: :tournament
    association :referee, factory: :user_referee
    association :field, factory: :court_field

    date { Faker::Date.in_date_period }
  end
end
