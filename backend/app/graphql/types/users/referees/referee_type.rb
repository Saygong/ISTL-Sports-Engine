# frozen_string_literal: true

module Types
  module Users
    module Referees
      class RefereeType < Types::BaseObject
        implements UserInterfaceType

        field :refereed_tournaments,
              [Tournaments::TournamentType],
              null: false

        def refereed_tournaments
          context[:current_user]
            .then do |referee|
              Tournament
                .joins(:matches)
                .where(matches: { referee_id: referee })
                .order(start_date: :asc)
                .distinct
            end
        end
      end
    end
  end
end
