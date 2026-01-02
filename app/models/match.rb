# frozen_string_literal: true
# == Schema Information
#
# Table name: matches
#
#  id             :integer          not null, primary key
#  created_at     :datetime         not null
#  date           :datetime
#  referee_id     :integer
#  tournament_id  :integer
#  updated_at     :datetime         not null
#  round          :integer
#  court_field_id :integer
#
# Indexes
#
#  index_matches_on_court_field_id  (court_field_id)
#  index_matches_on_referee_id      (referee_id)
#  index_matches_on_tournament_id   (tournament_id)
#

class Match < ApplicationRecord
  belongs_to :tournament

  belongs_to :referee,
             class_name: 'User::Referee',
             inverse_of: :refereed_matches,
             optional:   true

  belongs_to :field,
             class_name: 'Court::Field'

  has_one :match_result,
          class_name: 'Match::Result',
          dependent:  :destroy

  has_many :viewers_matches, dependent: :destroy
  has_many :viewers, through: :viewers_matches

  has_many :teams_matches, dependent: :destroy
  has_many :teams, through: :teams_matches
end
