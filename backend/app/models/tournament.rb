# frozen_string_literal: true

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
class Tournament < ApplicationRecord
  NUMBER_OF_MATCHES = [2, 4, 8, 16]
                      .freeze

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

  # ...
  after_create if: -> { teams.empty? } do
    (number_of_matches * 2)
      .times
      .each { teams.create! composition: composition }
  end

  validates :number_of_matches,
            inclusion: { in: NUMBER_OF_MATCHES }

  validates :min_age,
            :max_age,
            :number_of_matches,
            :start_date,
            presence: true

  # Custom validation to ensure age range is logically correct before saving
  validate do
    errors.add(:base, I18n.t('errors.models.tournament.min_age_gt_max_age')) if min_age > max_age
  end

  # ...
  enum :status, {
    waiting:   0,
    started:   1,
    completed: 2,
    expired:   3
  }

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
    waiting
      .where('min_age <= ?', player.years_from_birth)
      .where('max_age >= ?', player.years_from_birth)
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
  #   # single tournament
  #   #   true  if players.count >= number_of_matches * 2
  #   #   false otherwise
  #   # double tournament
  #   #   true  if players.count >= number_of_matches * 4
  #   #   false otherwise
  # @return [Boolean]
  def full?
    teams
      .map(&:players)
      .flatten
      .count
      .then do |players|
        players >= if single?
                     number_of_matches * 2
                   else
                     number_of_matches * 4
                   end
      end
  end

  # This follows the geometric progression of a complete binary tree.
  def total_number_of_matches
    # noinspection RubyMismatchedArgumentType
    (2**(depth + 1)) - 1
  end

  # In a bracket tournament, depth is the number of rounds needed to determine a winner.
  def depth
    # noinspection RubyMismatchedArgumentType
    Math
      .log2(number_of_matches)
      .ceil
  end

  # probabile validation per expired -> il tournament non ha seeded match e start date < now
end
