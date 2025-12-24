# frozen_string_literal: true

# == Schema Information
#
# Table name: tournaments
#
#  id            :integer          not null, primary key
#  user_id       :integer
#  sport         :integer          default(0)
#  gender        :integer          default(0), not null
#  min_birthdate :datetime
#  max_birthdate :datetime
#  start_date    :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_tournaments_on_user_id  (user_id)
#
class Tournament < ApplicationRecord
  include WithGender

  has_many :matches, dependent: :destroy

  belongs_to :organizer, class_name: 'User::Organizer', foreign_key: 'user_id', inverse_of: :tournaments
end
