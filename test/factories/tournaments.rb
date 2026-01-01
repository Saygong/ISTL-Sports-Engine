# == Schema Information
#
# Table name: tournaments
#
#  id                :integer          not null, primary key
#  created_at        :datetime         not null
#  description       :string
#  end_date          :datetime
#  field_id          :integer
#  name              :string
#  organizer_id      :integer
#  sport_id          :integer
#  start_date        :datetime
#  updated_at        :datetime         not null
#  max_age           :integer
#  min_age           :integer
#  gender            :integer          default(0), not null
#  number_of_matches :integer
#  format_kind       :integer          default(0), not null
#  court_id          :integer
#  composition       :integer          default(0), not null
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
  end
end
