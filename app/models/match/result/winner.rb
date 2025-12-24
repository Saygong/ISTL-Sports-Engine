# frozen_string_literal: true

# == Schema Information
#
# Table name: match_result_winners
#
#  id              :integer          not null, primary key
#  match_result_id :integer
#  user_id         :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_match_result_winners_on_match_result_id  (match_result_id)
#  index_match_result_winners_on_user_id          (user_id)
#
class Match
  class Result
    class Winner < ApplicationRecord
      belongs_to :match_result, class_name: 'Match::Result', inverse_of: :match_result_winners
      belongs_to :player, class_name: 'User::Player', foreign_key: 'user_id', inverse_of: :match_result_winners
    end
  end
end
