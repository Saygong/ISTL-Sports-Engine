# frozen_string_literal: true

# == Schema Information
#
# Table name: tournaments
#
#  id           :integer          not null, primary key
#  name         :string
#  description  :string
#  start_date   :datetime
#  end_date     :datetime
#  organizer_id :integer
#  sport_id     :integer
#  field_id     :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_tournaments_on_field_id      (field_id)
#  index_tournaments_on_organizer_id  (organizer_id)
#  index_tournaments_on_sport_id      (sport_id)
#
class Tournament < ApplicationRecord
  belongs_to :field
  belongs_to :sport

  belongs_to :organizer,
             class_name: 'User::Organizer',
             optional: true

  has_many :matches, dependent: :destroy

  has_many :players_tournaments, dependent: :destroy
  has_many :players, through: :players_tournaments

  has_many :referees_tournaments, dependent: :destroy
  has_many :referees, through: :referees_tournaments
end
