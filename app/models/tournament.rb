# frozen_string_literal: true

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
#  court_id          :integer
#  composition       :integer          default(0), not null
#
# Indexes
#
#  index_tournaments_on_court_id      (court_id)
#  index_tournaments_on_organizer_id  (organizer_id)
#  index_tournaments_on_sport_id      (sport_id)
#
class Tournament < ApplicationRecord
  include WithGender
  include WithComposition

  belongs_to :court
  belongs_to :sport

  belongs_to :organizer,
             class_name: 'User::Organizer',
             optional:   true

  has_many :matches, dependent: :destroy
  has_many :teams, dependent: :destroy

  has_many :referees_tournaments, dependent: :destroy
  has_many :referees, through: :referees_tournaments

  validates :min_age, presence: true
  validates :max_age, presence: true

  # ...
  validate do
    errors.add(:max_age, 'todo') if min_age > max_age
  end

  # ...
  scope :filter_by, lambda { |**cols|
    day = (Date.parse(cols[:start_date]) if cols[:start_date])

    # noinspection SqlNoDataSourceInspection
    all
      .then { cols[:name].present? ? it.where('tournaments.name ILIKE ?', "%#{cols[:name]}%") : it }
      .then { cols[:sport_id].present? ? where(sport_id: cols[:sport_id]) : it }
      .then { day.present? ? where(start_date: day.beginning_of_day..day.end_of_day) : it }
  }

  # ...
  scope :joinable_by, lambda { |player|
    # noinspection SqlNoDataSourceInspection
    where('min_age >= ?', player.years_from_birth)
      .where('max_age <= ?', player.years_from_birth)
      .where(gender: player.gender)
  }
end
