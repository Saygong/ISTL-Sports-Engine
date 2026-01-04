# frozen_string_literal: true

module Tournaments
  module Seeding
    # This class handles the initial draw generation for a single-elimination tournament. It distributes matches among
    # the available courts and calculates start times based on the facility's daily capacity.
    class Bracket < Base
      def seed? tournament
        # Check if the tournament is eligible for bracket generation
        return false unless tournament.full?
        return false unless tournament.waiting?

        true
      end

      def before_seed tournament
        # Prepare the instance variables needed for the seeding process. Retrieves the total number of available fields
        # to determine the distribution of matches, and the total number of available referees.
        @fields_count = tournament.court.fields.count
        @referees_count = tournament.referees.count

        [@fields_count, @referees_count]
          .min
          .then { @matches_per_day = it }
      end

      def start_seed tournament
        # Prepare all the variables needed for seeding the initial matches
        args = [@fields_count, @referees_count, @matches_per_day]

        tournament.instance_exec(*args) do |fields_count, referees_count, matches_per_day|
          number_of_matches
            .times do |index|
              # Pair teams in sequence (0-1, 2-3, 4-5, etc.) based on their registration/ranking order
              selected_teams = teams
                               .offset(index * 2) # It's like between?(index * 2, (index * 2) + 1)
                               .limit(2)

              # For consistency, matches are pinned at 12:00
              execution_date = (start_date + (index / matches_per_day).days).beginning_of_day + 12.hours

              # Create the match record with the calculated parameters
              matches.create! teams:   selected_teams,
                              field:   court.fields[index % fields_count],
                              referee: tournament.referees[index % referees_count],
                              date:    execution_date,
                              round:   0 # First round identifier
            end
        end
      end

      def after_seed tournament
        # Concludes the seeding process by updating the tournament status
        tournament.started!
      end
    end
  end
end
