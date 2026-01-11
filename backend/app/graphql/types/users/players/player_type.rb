# frozen_string_literal: true

module Types
  module Users
    module Players
      class PlayerType < Types::BaseObject
        implements UserInterfaceType

        field :joinable_tournaments,
              [Tournaments::TournamentType],
              null: false

        field :matches_to_play,
              [Matches::MatchType],
              null: false

        field :viewed_matches,
              [Matches::MatchType],
              null: false

        def matches_to_play
          # TODO: Only player should see the matches to play
          context[:current_user]
            .then do |player|
              Match
                .joins(teams: :players_teams)
                .where(players_teams: { player_id: player.id })
                .order(date:  :asc, round: :asc)
                .distinct
            end
        end

        def joinable_tournaments
          # TODO: Only player should see the joinable tournaments
          context[:current_user]
            .then { |player| Tournament.joinable_by(player) }
        end
      end
    end
  end
end
