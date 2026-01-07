# == Schema Information
#
# Table name: tournaments
#
#  id                :integer          not null, primary key
#  composition       :integer          default(0), not null
#  court_id          :integer
#  created_at        :datetime         not null
#  description       :string
#  end_date          :datetime
#  field_id          :integer
#  gender            :integer          default(0), not null
#  max_age           :integer
#  min_age           :integer
#  name              :string
#  number_of_matches :integer
#  organizer_id      :integer
#  sport_id          :integer
#  start_date        :datetime
#  updated_at        :datetime         not null
#  status            :integer          default(0)
#
# Indexes
#
#  index_tournaments_on_court_id      (court_id)
#  index_tournaments_on_organizer_id  (organizer_id)
#  index_tournaments_on_sport_id      (sport_id)
#

FactoryBot.define do
  factory :tournament do
    association :court, factory: :court
    association :organizer, factory: :user_organizer
    association :sport, factory: :sport

    min_age { Faker::Number.between(from: 20, to: 40) }
    max_age { Faker::Number.between(from: 45, to: 60) }

    number_of_matches { [2, 4, 8, 16].sample }
  end
end
