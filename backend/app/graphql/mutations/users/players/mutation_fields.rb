# frozen_string_literal: true

module Mutations
  module Users
    module Players
      module MutationFields
        def self.included base
          base.instance_exec do
            with_options role: :player do
              field :join_tournament, mutation: JoinTournament, role: :player
              field :book_match, mutation: BookMatch, role: :player
              field :unbook_match, mutation: UnbookMatch, role: :player
            end
          end
        end
      end
    end
  end
end
