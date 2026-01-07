# == Schema Information
#
# Table name: tournaments
#
#  id                :integer          not null, primary key
#  composition       :integer          default(0), not null
#  court_id          :integer
#  created_at        :datetime         not null
#  description       :string
#  end_date          :datetime
#  field_id          :integer
#  gender            :integer          default(0), not null
#  max_age           :integer
#  min_age           :integer
#  name              :string
#  number_of_matches :integer
#  organizer_id      :integer
#  sport_id          :integer
#  start_date        :datetime
#  updated_at        :datetime         not null
#  status            :integer          default(0)
#
# Indexes
#
#  index_tournaments_on_court_id      (court_id)
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

  test 'matches' do
    build(:match, tournament: nil)
      .then do |match|
        create(:tournament)
          .tap { it.matches << match }
          .tap(&:save!)
          .then do |tournament|
            assert_includes tournament.matches, match
            assert_equal match.tournament, tournament
          end
      end
  end
end
