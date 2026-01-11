# frozen_string_literal: true

module Types
  module Users
    module Queries
      def self.included base
        base.instance_exec do
          field :me, UserUnionType, null: false
        end
      end

      # ...
      def me
        context[:current_user]
      end
    end
  end
end
