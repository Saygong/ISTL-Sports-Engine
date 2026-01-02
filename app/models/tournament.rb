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
#  court_id          :integer
#  composition       :integer          default(0), not null
#
# Indexes
#
#  index_tournaments_on_court_id      (court_id)
#  index_tournaments_on_organizer_id  (organizer_id)
#  index_tournaments_on_sport_id      (sport_id)
#
class Tournament < ApplicationRecord
  include WithGender
  include WithComposition

  belongs_to :court
  belongs_to :sport

  belongs_to :organizer,
             class_name: 'User::Organizer',
             optional:   true

  has_many :matches, dependent: :destroy
  has_many :teams, dependent: :destroy

  has_many :referees_tournaments, dependent: :destroy
  has_many :referees, through: :referees_tournaments

  def eligible_for_tournament?(tournament, user)
    return false if user.nil? || user.birthdate.nil?

    age = ((Date.current - user.birthdate.to_date).to_i / 365.25).floor

    min_ok = tournament.min_age.blank? || age >= tournament.min_age
    max_ok = tournament.max_age.blank? || age <= tournament.max_age
    gender_ok = tournament.gender.blank? || user.gender == tournament.gender

    min_ok && max_ok && gender_ok
  end
end
