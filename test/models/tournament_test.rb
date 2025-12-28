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

require 'test_helper'

class TournamentTest < ActiveSupport::TestCase
  test 'creation' do
    assert_nothing_raised do
      create :tournament
      create :tournament, organizer: nil
    end
  end
end
