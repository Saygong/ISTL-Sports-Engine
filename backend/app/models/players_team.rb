# frozen_string_literal: true

# == Schema Information
#
# Table name: players_teams
#
#  id         :integer          not null, primary key
#  player_id  :integer
#  team_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_players_teams_on_player_id  (player_id)
#  index_players_teams_on_team_id    (team_id)
#
class PlayersTeam < ApplicationRecord
  belongs_to :player, class_name: 'User::Player'
  belongs_to :team

  # Create initial matches as soon as the tournament has reached full capacity
  after_create if: -> { team.tournament.waiting? && team.tournament.full? } do
    Tournaments::Seeding::Bracket
      .new
      .seed! team.tournament
  end
end
