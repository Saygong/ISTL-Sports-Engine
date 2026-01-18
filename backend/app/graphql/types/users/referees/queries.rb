# frozen_string_literal: true

module Types
  module Users
    module Referees
      module Queries
        def self.included base
          base.instance_exec do
            field :referees_all, [RefereeType], null: false
          end
        end

        def referees_all
          User::Referee.all
        end
      end
    end
  end
end
