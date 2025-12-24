# frozen_string_literal: true

# == Schema Information
#
# Table name: matches
#
#  id            :integer          not null, primary key
#  tournament_id :integer
#  start_at      :datetime
#  end_at        :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_matches_on_tournament_id  (tournament_id)
#
class Match < ApplicationRecord
  belongs_to :tournament

  has_one :result, class_name: 'Match::Result', dependent: :destroy

  has_many :match_players, class_name: 'Match::Player', dependent: :destroy
  has_many :players, through: :match_players

  has_many :match_viewers, class_name: 'Match::Viewer', dependent: :destroy
  has_many :viewers, through: :match_viewers
end
