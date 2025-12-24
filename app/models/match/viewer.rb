# frozen_string_literal: true

# == Schema Information
#
# Table name: match_viewers
#
#  id         :integer          not null, primary key
#  match_id   :integer
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_match_viewers_on_match_id  (match_id)
#  index_match_viewers_on_user_id   (user_id)
#
class Match
  class Viewer < ApplicationRecord
    belongs_to :match
    belongs_to :viewer,
               class_name:  'User',
               foreign_key: 'user_id',
               inverse_of:  :match_viewers
  end
end
