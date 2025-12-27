# frozen_string_literal: true

# == Schema Information
#
# Table name: players_tournaments
#
#  id            :integer          not null, primary key
#  player_id     :integer
#  tournament_id :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_players_tournaments_on_player_id      (player_id)
#  index_players_tournaments_on_tournament_id  (tournament_id)
#
class PlayersTournament < ApplicationRecord
  belongs_to :tournament
  belongs_to :player, class_name: 'User::Player'
end
