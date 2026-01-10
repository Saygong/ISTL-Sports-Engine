# frozen_string_literal: true

# == Schema Information
#
# Table name: teams
#
#  id            :integer          not null, primary key
#  tournament_id :integer
#  name          :string
#  composition   :integer          default(0), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_teams_on_tournament_id  (tournament_id)
#
class Team < ApplicationRecord
  include WithComposition

  belongs_to :tournament

  has_many :players_teams, dependent: :destroy
  has_many :players, through: :players_teams

  has_many :teams_matches, dependent: :destroy
  has_many :matches, through: :teams_matches

  has_many :teams_match_results, dependent: :destroy
  has_many :match_results, through: :teams_match_results

  # Automatically generate a team name based on player names if there is no name
  before_save if: -> { players.present? }, unless: :name_changed? do
    self.name = players
                .map { "#{it.first_name} #{it.last_name}" }
                .join(' - ')
  end

  # Before allowing a new team to register, make sure the tournament has not exceeded its maximum capacity
  validate if: -> { tournament.full? }, on: :create do
    errors.add(:base, I18n.t('errors.models.team.tournament_teams_capacity'))
  end

  # ...
  scope :joined_by_someone, lambda {
    # noinspection SqlNoDataSourceInspection
    joins(:tournament, :players_teams)
      .where(composition: :double)
      .where(tournament: { composition: :double })
      .group('teams.id')
      .having('COUNT(*) > 0')
      .distinct
  }

  # Refine the joinable scope to exclude teams that the specific player is already a member of
  scope :joinable_by, lambda { |player|
    # ...
    subscribed_tournament = Tournament
                            .joins(teams: :players)
                            .where(players: { id: player })

    # noinspection SqlNoDataSourceInspection
    left_joins(:tournament, :players_teams)
      .where(composition: :double)
      .where(tournament: { composition: :double })
      .where(players_teams: { player_id: nil })
      .where.not(tournament: { id: subscribed_tournament })
      .or(
        where(id: joins(:tournament, :players_teams)
                    .where(composition: :double)
                    .where(tournament: { composition: :double })
                    .where.not(tournament: { id: subscribed_tournament })
                    .group('teams.id')
                    .having('COUNT(*) < 2')
                    .select('teams.id')).where.not(players_teams: { player_id: player })
      ).distinct
  }
end
