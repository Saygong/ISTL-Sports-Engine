# frozen_string_literal: true

# == Schema Information
#
# Table name: matches
#
#  id             :integer          not null, primary key
#  court_field_id :integer
#  created_at     :datetime         not null
#  date           :datetime
#  referee_id     :integer
#  round          :integer
#  tournament_id  :integer
#  updated_at     :datetime         not null
#  match_id       :integer
#
# Indexes
#
#  index_matches_on_court_field_id  (court_field_id)
#  index_matches_on_match_id        (match_id)
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

  # The next match that should be played
  belongs_to :match, optional: true

  has_one :match_result,
          class_name: 'Match::Result',
          dependent:  :destroy

  has_many :viewers_matches, dependent: :destroy
  has_many :viewers, through: :viewers_matches

  has_many :teams_matches, dependent: :destroy
  has_many :teams, through: :teams_matches

  # The matches from which this match originated
  has_many :matches, dependent: :destroy

  validates :date, presence: true

  # Games played by the indicated player.
  scope :played_by, lambda { |player|
    joins(teams: :players)
      .where(players: { id: player.id })
  }

  # Incomplete games with fewer than two teams playing against each other
  scope :incomplete, lambda {
    left_joins(teams: :players)
      .group(:id)
      .having("COUNT(#{User.table_name}.id) < 2")
  }

  alias next_match match

  # Organizes the players of a match into a mapped hash based on the match ID. It is used to perform easy searches on
  # opposite sides.
  #
  # @return [Hash] A nested hash containing left and right player collections.
  def participants_by_match_id
    { id => {
      left:  teams&.first&.players || [],
      right: teams&.last&.players || []
    } }
  end
end
