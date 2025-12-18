class Tournament < ApplicationRecord
  belongs_to :organizer

  validates :tournament_type, presence: true
  validates :gender_limitation, length: { is: 1 }
  validates :age_limitation
  validates :start_date, presence: true
end
