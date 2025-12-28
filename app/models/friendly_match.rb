# frozen_string_literal: true

# == Schema Information
#
# Table name: friendly_matches
#
#  id         :integer          not null, primary key
#  player_id  :integer
#  sport_id   :integer
#  field_id   :integer
#  date       :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_friendly_matches_on_field_id   (field_id)
#  index_friendly_matches_on_player_id  (player_id)
#  index_friendly_matches_on_sport_id   (sport_id)
#
class FriendlyMatch < ApplicationRecord
  belongs_to :organized_by,
             class_name: 'User::Player',
             foreign_key: :player_id,
             inverse_of: :friendly_matches_organized

  belongs_to :field
  belongs_to :sport

  has_many :players_friendly_matches, dependent: :destroy
  has_many :players, through: :players_friendly_matches
end
