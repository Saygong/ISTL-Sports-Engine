# frozen_string_literal: true

# == Schema Information
#
# Table name: viewers_matches
#
#  id         :integer          not null, primary key
#  viewer_id  :integer
#  match_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_viewers_matches_on_match_id   (match_id)
#  index_viewers_matches_on_viewer_id  (viewer_id)
#
class ViewersMatch < ApplicationRecord
  belongs_to :viewer, class_name: 'User::Player', inverse_of: :viewers_matches
  belongs_to :match
end
