# frozen_string_literal: true

class Match
  # == Schema Information
  #
  # Table name: match_results
  #
  #  id          :integer          not null, primary key
  #  match_id    :integer
  #  user_id     :integer
  #  description :string
  #  created_at  :datetime         not null
  #  updated_at  :datetime         not null
  #
  # Indexes
  #
  #  index_match_results_on_match_id  (match_id)
  #  index_match_results_on_user_id   (user_id)
  #
  class Result < ApplicationRecord
    belongs_to :match

    belongs_to :referee,
               class_name:  'User::Referee',
               foreign_key: 'user_id',
               inverse_of:  :match_results
  end
end
