# frozen_string_literal: true

# == Schema Information
#
# Table name: teams
#
#  id            :integer          not null, primary key
#  tournament_id :integer
#  name          :string
#  composition   :integer          default(0), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_teams_on_tournament_id  (tournament_id)
#
class Team < ApplicationRecord
  belongs_to :tournament

  has_many :players_teams, dependent: :destroy
  has_many :players, through: :players_teams

  enum :composition, {
    single: 0,
    double: 1,
  }
end
