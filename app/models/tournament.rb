# frozen_string_literal: true

# == Schema Information
#
# Table name: tournaments
#
#  id                :integer          not null, primary key
#  created_at        :datetime         not null
#  description       :string
#  end_date          :datetime
#  field_id          :integer
#  name              :string
#  organizer_id      :integer
#  sport_id          :integer
#  start_date        :datetime
#  updated_at        :datetime         not null
#  max_age           :integer
#  min_age           :integer
#  gender            :integer          default(0), not null
#  number_of_matches :integer
#  format_kind       :integer          default(0), not null
#
# Indexes
#
#  index_tournaments_on_field_id      (field_id)
#  index_tournaments_on_organizer_id  (organizer_id)
#  index_tournaments_on_sport_id      (sport_id)
#
class Tournament < ApplicationRecord
  include WithGender

  belongs_to :field
  belongs_to :sport

  belongs_to :organizer,
             class_name: 'User::Organizer',
             optional:   true

  has_many :matches, dependent: :destroy
  has_many :teams, dependent: :destroy

  has_many :referees_tournaments, dependent: :destroy
  has_many :referees, through: :referees_tournaments

  enum :format_kind, { single: 0, double: 1 }
end
