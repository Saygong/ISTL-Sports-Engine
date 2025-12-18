class Tournament < ApplicationRecord
  belongs_to :organizer

  validates :tournament_type, presence: true
  validates :gender_limitation, length: { is: 1 }, allow_nil: true
  validates :age_limitation, presence: true
  validates :start_date, presence: true
end
