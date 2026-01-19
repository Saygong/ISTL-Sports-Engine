# frozen_string_literal: true

module Mutations
  module Users
    module Organizers
      module MutationFields
        def self.included base
          base.instance_exec do
            field :create_tournament,
                  mutation: CreateTournament,
                  role:     :organizer
          end
        end
      end
    end
  end
end
