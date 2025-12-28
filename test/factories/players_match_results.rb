# == Schema Information
#
# Table name: players_match_results
#
#  id              :integer          not null, primary key
#  player_id       :integer
#  match_result_id :integer
#  player_status   :integer          not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_players_match_results_on_match_result_id  (match_result_id)
#  index_players_match_results_on_player_id        (player_id)
#

FactoryBot.define do
  factory :players_match_result do
    association :match_result, factory: :match_result
    association :player, factory: :user_player

    player_status { PlayersMatchResult.player_statuses.keys.sample }
  end
end
