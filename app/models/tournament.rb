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

  validates :number_of_matches,
            inclusion: { in: [2, 4, 8, 16] }

  validates :min_age,
            :max_age,
            :number_of_matches,
            presence: true

  # Custom validation to ensure age range is logically correct before saving
  validate do
    errors.add(:base, I18n.t('errors.models.tournament.min_age_gt_max_age')) if min_age > max_age
  end

  # ...
  enum :status, {
    waiting:   0,
    started:   1,
    completed: 2
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
    where('min_age <= ?', player.years_from_birth)
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
  def teams_capacity
    number_of_matches * 2
  end

  # probabile validation per expired -> il tournament non ha seeded match e start date < now

  # ...
  # Questo andrà in un change di stato.
  def match_seeding!
    # ... ready?
    return nil unless teams.count == teams_capacity
    return nil unless waiting?

    # ...
    matches_per_day = court
                      .fields
                      .count

    transaction do
      # noinspection RubyNilAnalysis
      number_of_matches
        .times do |index|
          # ...
          selected_teams = teams
                           .offset(index * 2) # It's like between?(index * 2, (index * 2) + 1)
                           .limit(2)

          (start_date + (index / matches_per_day).days)
            .advance(12.hours)
            .then do |date|
              matches.create! teams: selected_teams,
                              field: court.fields[index % matches_per_day],
                              date:  date,
                              round: 0
            end
        end

      # ...
      started!
    end
  end

  # ...
  # def create_match! player
  #   ActiveRecord::Base.transaction do
  #     matches
  #       .create!
  #       .teams
  #       .create!(composition: composition)
  #       .players_teams
  #       .create! player: player
  #   end
  # end
end
