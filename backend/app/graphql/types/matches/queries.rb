# frozen_string_literal: true

module Types
  module Matches
    module Queries
      def self.included base
        base.instance_exec do
          field :match, MatchType, null: false do
            argument :id, GraphQL::Types::ID, required: true
          end
        end
      end

      def match id:
        Match.find id
      end
    end
  end
end
