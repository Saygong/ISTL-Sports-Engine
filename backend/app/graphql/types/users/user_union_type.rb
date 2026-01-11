# frozen_string_literal: true

module Types
  module Users
    class UserUnionType < Types::BaseUnion
      possible_types Organizers::OrganizerType,
                     Referees::RefereeType,
                     Players::PlayerType

      def self.resolve_type object, _context
        if object.is_a?(User::Player)
          Players::PlayerType
        elsif object.is_a?(User::Referee)
          Referees::RefereeType
        else
          Organizers::OrganizerType
        end
      end
    end
  end
end
