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
end
