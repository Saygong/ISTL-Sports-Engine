FactoryBot.define do
  factory :court_field, class: 'Court::Field' do
    association :court, factory: :court
  end
end
