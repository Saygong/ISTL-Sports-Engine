# frozen_string_literal: true

module Mutations
  module Users
    module Players
      module MutationFields
        def self.included base
          base.instance_exec do
            field :join_tournament, mutation: JoinTournament, role: :player
          end
        end
      end
    end
  end
end
