# == Schema Information
#
# Table name: matches
#
#  id            :integer          not null, primary key
#  created_at    :datetime         not null
#  date          :datetime
#  referee_id    :integer
#  tournament_id :integer
#  updated_at    :datetime         not null
#  round         :integer
#
# Indexes
#
#  index_matches_on_referee_id     (referee_id)
#  index_matches_on_tournament_id  (tournament_id)
#

FactoryBot.define do
  factory :match do
    association :tournament, factory: :tournament
    association :referee, factory: :user_referee
  end
end
