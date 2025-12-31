# frozen_string_literal: true

# == Schema Information
#
# Table name: matches
#
#  id            :integer          not null, primary key
#  referee_id    :integer
#  tournament_id :integer
#  date          :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_matches_on_referee_id     (referee_id)
#  index_matches_on_tournament_id  (tournament_id)
#
class Match < ApplicationRecord
  belongs_to :tournament

  belongs_to :referee,
             class_name: 'User::Referee',
             inverse_of: :refereed_matches,
             optional:   true

  has_many :viewers_matches, dependent: :destroy
  has_many :viewers, through: :viewers_matches

  has_many :players_matches, dependent: :destroy
  has_many :players, through: :players_matches



end
