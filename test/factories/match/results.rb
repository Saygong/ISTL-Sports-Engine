FactoryBot.define do
  factory :match_result, class: 'Match::Result' do
    description { Faker::Lorem.sentence }
  end
end
