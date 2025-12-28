FactoryBot.define do
  factory :match_result, class: 'Match::Result' do
    association :match, factory: :match
  end
end
