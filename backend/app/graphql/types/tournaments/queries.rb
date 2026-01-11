# frozen_string_literal: true

module Types
  module Tournaments
    module Queries
      def self.included base
        base.instance_exec do
          field :tournaments_all, [TournamentType], null: false do
            argument :search, TournamentSearchInput, required: false
          end
        end
      end

      def tournaments_all search:
        Tournament
          .all
          .then { search&.[](:name) ? it.where(name: search[:name]) : it }
          .then { search&.[](:sport_id) ? it.where(name: search[:sport_id]) : it }
          .then { search&.[](:start_date) ? it.where(start_date: search[:start_date]) : it }
      end
    end
  end
end
