# == Schema Information
#
# Table name: referees_tournaments
#
#  id            :integer          not null, primary key
#  referee_id    :integer
#  tournament_id :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_referees_tournaments_on_referee_id     (referee_id)
#  index_referees_tournaments_on_tournament_id  (tournament_id)
#

# frozen_string_literal: true

class RefereesTournament < ApplicationRecord
  belongs_to :referee, class_name: 'User::Referee'
  belongs_to :tournament
end
