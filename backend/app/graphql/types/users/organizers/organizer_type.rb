# frozen_string_literal: true

module Types
  module Users
    module Organizers
      class OrganizerType < Types::BaseObject
        implements UserInterfaceType

        # noinspection RubyArgCount
        field :tournaments,
              [Tournaments::TournamentType],
              null: false,
              role: :organizer

        def tournaments
          context[:current_user]
            .then do |organizer|
              Tournament.where(organizer: organizer)
            end
        end
      end
    end
  end
end
