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

class User::PlayerTest < ActiveSupport::TestCase
  test 'creation' do
    create(:user_player)
      .then { assert_equal User::Player.last!, it }
  end

  test 'with teams' do
    create(:team)
      .then do |team|
        create(:user_player)
          .tap { it.teams << team }
          .tap(&:save!)
          .then do |player|
            assert_includes player.teams, team
            assert_includes team.players, player
          end
      end
  end

  test 'match results' do
    create(:match_result)
      .then do |match_result|
        create(:user_player)
          .tap { it.players_match_results << build(:players_match_result, match_result: match_result) }
          .tap(&:save!)
          .then do |player|
            assert_includes player.match_results, match_result
            assert_includes match_result.players, player
          end
      end
  end

  test 'matches' do
    create(:match)
      .then do |match|
        create(:user_player)
          .tap { it.matches << match }
          .tap(&:save!)
          .then do |player|
            assert_includes player.matches, match
            assert_includes match.players, player
          end
      end
  end

  test 'won and lost matches' do
    { winner: :won_by, loser: :lost_by }
      .each do |status, scope|
        create(:match_result)
          .then do |match_result|
            build(:players_match_result, match_result: match_result, player_status: status)
              .then do |match|
                create(:user_player)
                  .tap { it.players_match_results << match }
                  .tap(&:save!)
                  .then do |player|
                    Match::Result
                      .public_send(scope, player)
                      .map(&:players)
                      .flatten
                      .then { |players| assert_includes players, player }
                  end
              end
          end
      end
  end

  test 'viewed matches' do
    create(:match)
      .then do |match|
        # Create a user for each type.
        # Each user will be able to see one match.
        users = [:player]
                .map do |type|
                  # noinspection RailsParamDefResolve
                  create(:"user_#{type}")
                    .tap { match.viewers << it }
                end

        # Save the game with spectators.
        match.save!

        # Test the associations.
        users.each do |user|
          assert_includes match.viewers, user
          assert_includes user.viewed_matches, match
        end
      end
  end
end
