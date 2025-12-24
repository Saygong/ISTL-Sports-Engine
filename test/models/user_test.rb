# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  uid                    :string           default(""), not null
#  provider               :string           default("email"), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  allow_password_change  :boolean          default(FALSE)
#  remember_created_at    :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  tokens                 :json
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  type                   :string           default("User")
#  data                   :jsonb            default("{}"), not null
#  first_name             :string
#  last_name              :string
#  birthdate              :datetime
#  gender                 :integer          default(0), not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_data                  (data)
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_uid_and_provider      (uid,provider) UNIQUE
#

require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def types
    User
      .constants
      .map { "User::#{it}" }
      .map(&:constantize)
      .filter { it.is_a? Class }
      .filter { it < User }
  end

  test 'user creation' do
    assert_nothing_raised do
      types.each { |type| create(:user, :with_email, type: type.to_s) }
    end
  end

  test 'user type' do
    types.each do |type|
      create(:user, :with_email, type: type.to_s)
        .then { assert_instance_of type, type.public_send(:last) }
    end
  end

  test 'user with attendances' do
    create_match
      .then do |match|
        viewers = types
                  .map do |type|
                    create(:user, :with_email, type: type.to_s)
                      .tap { create :match_viewer, match: match, viewer: it }
                  end

        [match, viewers]
      end.then do |match, viewers|
        viewers.each { assert_includes match.viewers, it }
        viewers.each { assert_includes it.attendances, match }
      end
  end

  test 'player with matches' do
    create_match
      .tap { |match| create :match_player, match: match, player: create_player }
      .then do |match|
        assert_includes User::Player.last!.matches, match
        assert_includes match.players, User::Player.last!
      end
  end

  test 'player with wins' do
    [create_player, create(:match_result, match: create_match, referee: create_referee)].then do |player, result|
      create(:match_result_winner, match_result: result, player: player)
        .then do
          # Player should see the result in won_matches
          assert_includes player.won_matches, result

          # The result should list the player as a winner
          assert_includes result.winners, player
        end
    end
  end

  test 'referee with matches' do
    [create_match, create_referee].then do |match, referee|
      create(:match_result, match: match, referee: referee)
        .then do |result|
          assert_includes referee.match_results, result
          assert_equal result.referee, referee
        end
    end
  end
end
