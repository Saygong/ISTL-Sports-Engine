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

  scope :joinable, lambda {
    # noinspection SqlNoDataSourceInspection
    joins(:tournament, :players_teams)
      .where(composition: :double)
      .where(tournament: { composition: :double })
      .then do |scope|
        scope
          .where(players_teams: { player_id: nil })
          .or(where(id: scope
                          .group('teams.id')
                          .having('COUNT(*) < 2')
                          .select('teams.id')))
      end
  }
end
