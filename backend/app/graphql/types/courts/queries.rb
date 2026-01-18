# frozen_string_literal: true

module Types
  module Courts
    module Queries
      def self.included base
        base.instance_exec do
          field :courts_all, [CourtType], null: false
        end
      end
    end
  end
end
