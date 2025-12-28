# frozen_string_literal: true

# == Schema Information
#
# Table name: players_matches
#
#  id         :integer          not null, primary key
#  player_id  :integer
#  match_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_players_matches_on_match_id   (match_id)
#  index_players_matches_on_player_id  (player_id)
#
class PlayersMatch < ApplicationRecord
  belongs_to :player, class_name: 'User::Player'
  belongs_to :match
end
