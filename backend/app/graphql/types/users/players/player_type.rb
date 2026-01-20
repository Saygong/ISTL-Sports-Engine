# frozen_string_literal: true

module Types
  module Users
    module Players
      class PlayerType < Types::BaseObject
        implements UserInterfaceType

        with_options role: :player, null: false do
          field :joinable_tournaments, [Tournaments::TournamentType]
          field :joined_tournaments, [Tournaments::TournamentType]
          field :matches_to_play, [Matches::MatchType]
          field :booked_matches, [Matches::MatchType]
          field :won_matches, [Matches::Results::ResultType]
          field :lost_matches, [Matches::Results::ResultType]
          field :joinable_teams, [Teams::TeamType] do
            argument :tournament_id, GraphQL::Types::ID, required: true
          end
        end

        def booked_matches
          context[:current_user]
            .then(&:viewed_matches)
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
          # noinspection RubyResolve
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
