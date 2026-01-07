# frozen_string_literal: true

# == Schema Information
#
# Table name: teams_matches
#
#  id         :integer          not null, primary key
#  team_id    :integer
#  match_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_teams_matches_on_match_id  (match_id)
#  index_teams_matches_on_team_id   (team_id)
#
class TeamsMatch < ApplicationRecord
  belongs_to :team
  belongs_to :match
end
