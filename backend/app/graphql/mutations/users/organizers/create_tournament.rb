# frozen_string_literal: true

module Mutations
  module Users
    module Organizers
      class CreateTournament < BaseMutation
        class TournamentDataArgs < Types::BaseInputObject
          argument :name, GraphQL::Types::String, required: true
          argument :start_date, GraphQL::Types::ISO8601Date, required: true
          argument :min_age, GraphQL::Types::Int, required: true
          argument :max_age, GraphQL::Types::Int, required: true
          argument :number_of_matches, GraphQL::Types::Int, required: true

          argument :gender, Types::Common::GenderEnumType, required: true
          argument :composition, Types::Common::CompositionEnumType, required: true

          argument :referees, [GraphQL::Types::ID], required: true
          argument :sport, GraphQL::Types::ID, required: true
          argument :court, GraphQL::Types::ID, required: true
        end

        argument :args, TournamentDataArgs, required: true
        type Types::Users::Organizers::OrganizerType

        def resolve args:
          context[:current_user]
            .tap do |organizer|
              Tournament.create! organizer:         organizer,
                                 name:              args[:name],
                                 sport:             args[:sport],
                                 start_date:        args[:start_date],
                                 court:             args[:court],
                                 min_age:           args[:min_age],
                                 max_age:           args[:max_age],
                                 gender:            args[:gender],
                                 composition:       args[:composition],
                                 number_of_matches: args[:number_of_matches],
                                 referees:          args[:referees]
            end
        end
      end
    end
  end
end
