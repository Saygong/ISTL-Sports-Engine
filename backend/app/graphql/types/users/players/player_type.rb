# frozen_string_literal: true

module Types
  module Users
    module Players
      class PlayerType < Types::BaseObject
        implements UserInterfaceType

        # TODO: Only player should see this field
        field :joinable_tournaments,
              [Tournaments::TournamentType],
              null: false

        # TODO: Only player should see this field
        field :joined_tournaments,
              [Tournaments::TournamentType],
              null: false

        # TODO: Only player should see this field
        field :matches_to_play,
              [Matches::MatchType],
              null: false

        # TODO: Only player should see this field
        field :viewed_matches,
              [Matches::MatchType],
              null: false

        # TODO: Only player should see this field
        field :won_matches,
              [Matches::Results::ResultType],
              null: false

        # TODO: Only player should see this field
        field :lost_matches,
              [Matches::Results::ResultType],
              null: false

        # TODO: Only player should see this field
        field :joinable_teams, [Teams::TeamType], null: false do
          argument :tournament_id, GraphQL::Types::ID, required: true
        end

        def joinable_teams tournament_id:
          context[:current_user]
            .then do |player|
              Tournament
                .find(tournament_id)
                .teams
                .joinable_by(player)
            end
        end

        def won_matches
          context[:current_user]
            .then { |player| Match::Result.won_by(player) }
        end

        def lost_matches
          # noinspection RubyResolve
          context[:current_user]
            .then { |player| Match::Result.lost_by(player) }
        end

        def matches_to_play
          context[:current_user]
            .then do |player|
              Match
                .joins(teams: :players_teams)
                .where(players_teams: { player_id: player.id })
                .order(date: :asc, round: :asc)
                .distinct
            end
        end

        def joined_tournaments
          context[:current_user]
            .then { |player| Tournament.joined_by(player) }
        end

        def joinable_tournaments
          context[:current_user]
            .then { |player| Tournament.joinable_by(player) }
        end
      end
    end
  end
end
