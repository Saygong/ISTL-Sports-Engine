# frozen_string_literal: true

# == Schema Information
#
# Table name: players_friendly_matches
#
#  id                :integer          not null, primary key
#  player_id         :integer
#  friendly_match_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_players_friendly_matches_on_friendly_match_id  (friendly_match_id)
#  index_players_friendly_matches_on_player_id          (player_id)
#
class PlayersFriendlyMatch < ApplicationRecord
  belongs_to :player, class_name: 'User::Player'
  belongs_to :friendly_match
end
