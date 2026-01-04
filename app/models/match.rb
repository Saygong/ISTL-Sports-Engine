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
             class_name:  'Court::Field',
             foreign_key: 'court_field_id'

  has_one :match_result,
          class_name: 'Match::Result',
          dependent:  :destroy

  has_many :viewers_matches, dependent: :destroy
  has_many :viewers, through: :viewers_matches

  has_many :teams_matches, dependent: :destroy
  has_many :teams, through: :teams_matches

  validates :date, presence: true

  # ...
  scope :played_by, lambda { |player|
    joins(teams: :players)
      .where(players: { id: player.id })
  }

  # Organizes the players of a match into a mapped hash based on the match ID. It is used to perform easy searches on
  # opposite sides.
  #
  # @return [Hash, nil] A nested hash containing left and right player collections.
  def participants_by_match_id
    return unless teams.many?

    { id => {
      left:  teams.first.players,
      right: teams.last.players
    } }
  end
end
