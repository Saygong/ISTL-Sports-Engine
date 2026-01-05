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

        # Bottleneck capacity based on available resources
        [@fields_count, @referees_count]
          .min
          .then { @matches_per_day = it }

        # Generate a chronological list of dates, then reverse it. This allows the recursion (starting from the final)
        # to choose the most recent dates first.
        @dates_desc = tournament
                      .total_number_of_matches
                      .times
                      .map { (tournament.start_date + (it / @matches_per_day).days).beginning_of_day + 12.hours }
                      .reverse
      end

      def start_seed tournament
        # Recursive helper to build binary tree structure
        recursive_helper = proc do |hash|
          # Pattern matching to extract recursive state. Pointers are simply integers that are used to access the
          # correct elements in the field, referrer, and date arrays.
          hash => { root:, round:, tree_layer:, max_depth:, f_pointer:, r_pointer:, n_pointer: }

          if tree_layer <= max_depth
            node = Match.create! tournament: @tournament,
                                 field:      tournament.court.fields[f_pointer % @fields_count],
                                 referee:    tournament.referees[r_pointer % @referees_count],
                                 match:      root, # Link to the next match
                                 round:      round,
                                 date:       @dates_desc[n_pointer]

            node.tap do
              # There is no need to perform a recursion step when the final layer is equal to the maximum depth
              if tree_layer < max_depth
                spawn_children = proc do |internal_f_pointer, internal_r_pointer, internal_n_pointer|
                  { root:       node,
                    round:      round - 1,
                    tree_layer: tree_layer + 1,
                    max_depth:  max_depth,
                    f_pointer:  internal_f_pointer,
                    r_pointer:  internal_r_pointer,
                    n_pointer:  internal_n_pointer }.then { recursive_helper.call it }
                end

                spawn_children.call(f_pointer + 1, r_pointer + 1, (n_pointer * 2) + 2)
                spawn_children.call(f_pointer + 2, r_pointer + 2, (n_pointer * 2) + 1)
              end
            end
          end
        end

        # Initialize recursion to the final (highest) round
        { root:       nil,
          round:      @tournament.depth,
          tree_layer: 0,
          max_depth:  @tournament.depth,
          f_pointer:  0,
          r_pointer:  0,
          n_pointer:  0 }.then { recursive_helper.call it }

        # Only the first round features teams at the start of the tournament
        Match
          .where(tournament: @tournament)
          .where(round: 0)
          .each_with_index do |match, index|
            # Pair teams in sequence (0-1, 2-3, 4-5, etc.) based on their registration/ranking order
            @tournament
              .teams
              .offset(index * 2)
              .limit(2)
              .then { |teams| match.update! teams: teams }
          end
      end

      def after_seed tournament
        # Concludes the seeding process by updating the tournament status
        tournament.started!
      end
    end
  end
end
