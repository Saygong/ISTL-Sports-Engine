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

  validates :min_age,
            :max_age,
            :number_of_matches,
            presence: true

  # Custom validation to ensure age range is logically correct before saving
  validate do
    errors.add(:base, I18n.t('errors.models.tournament.min_age_gt_max_age')) if min_age > max_age
  end

  # Scope that accepts a hash of search parameters, name, sport, and date.
  scope :filter_by, lambda { |**cols|
    day = Date.parse(cols[:start_date]) rescue nil # rubocop:disable Style/RescueModifier

    # noinspection SqlNoDataSourceInspection
    all
      .then { cols[:name].present? ? it.where('tournaments.name ILIKE ?', "%#{cols[:name]}%") : it }
      .then { cols[:sport_id].present? ? where(sport_id: cols[:sport_id]) : it }
      .then { day.present? ? where(start_date: day.beginning_of_day..day.end_of_day) : it }
  }

  # All tournaments where a specific player's profile meets the requirements.
  scope :joinable_by, lambda { |player|
    # noinspection SqlNoDataSourceInspection
    where('min_age >= ?', player.years_from_birth)
      .where('max_age <= ?', player.years_from_birth)
      .where(gender: player.gender)
  }

  # All tournaments a specific player has already participated in.
  scope :joined_by, lambda { |player|
    Tournament
      .joins(teams: :players)
      .where(players: { id: player.id })
  }

  # Calculate the total team capacity based on the tournament format. Assuming each match requires exactly two teams,
  # the capacity is double the number of scheduled matches.
  def teams_capacity
    number_of_matches * 2
  end

end
