# frozen_string_literal: true

module Helpers
  module Model
    def create_tournament
      create :tournament,
             sport:     create(:sport),
             field:     create(:field),
             organizer: create_organizer
    end

    def create_friendly_match
      build(:friendly_match, sport: create(:sport), field: create(:field))
        .then do |match|
          player = create_player
                   .tap { it.friendly_matches_organized << match }
                   .tap(&:save!)

          [match, player]
        end
    end

    # Define user creation for a specific type using metaprogramming techniques
    [:player, :organizer, :referee].each do |type|
      define_method("create_#{type}") do |**cols|
        "User::#{type.to_s.camelize}"
          .constantize
          .then do |klass|
            create(:user, :with_email, type: klass.to_s, **cols).then { klass.find(it.id) }
          end
      end
    end
  end
end
