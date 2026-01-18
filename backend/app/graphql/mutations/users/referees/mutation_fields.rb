# frozen_string_literal: true

module Mutations
  module Users
    module Referees
      module MutationFields
        def self.included base
          base.instance_exec do
            field :create_match_result, mutation: CreateMatchResult, role: :referee
          end
        end
      end
    end
  end
end
