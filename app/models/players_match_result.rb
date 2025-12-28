# frozen_string_literal: true

# == Schema Information
#
# Table name: players_match_results
#
#  id              :integer          not null, primary key
#  player_id       :integer
#  match_result_id :integer
#  player_status   :integer          default(0), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_players_match_results_on_match_result_id  (match_result_id)
#  index_players_match_results_on_player_id        (player_id)
#
class PlayersMatchResult < ApplicationRecord
  belongs_to :match_result, class_name: 'Match::Result', inverse_of: :players_match_results
  belongs_to :player, class_name: 'User::Player'

  enum :player_status, {
    winner: 0,
    loser:  1
  }
end
