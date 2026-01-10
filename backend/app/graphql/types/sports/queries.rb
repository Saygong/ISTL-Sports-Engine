# frozen_string_literal: true

module Types
  module Sports
    module Queries
      def self.included base
        base.field :sports_all, [SportType], null: false
      end

      def sports_all
        Sport.all
      end
    end
  end
end
