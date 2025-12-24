# frozen_string_literal: true

module Helpers
  module Model
    def create_match
      create(:user, :with_email, type: 'User::Organizer')
        .then { User::Organizer.find(it.id) }
        .then { create(:match, tournament: create(:tournament, organizer: it)) }
    end

    # Define user creation for a specific type using metaprogramming techniques
    [:player, :organizer, :referee].each do |type|
      define_method("create_#{type}") do
        "User::#{type.to_s.camelize}"
          .constantize
          .then do |klass|
            create(:user, :with_email, type: klass.to_s).then { klass.find(it.id) }
          end
      end
    end
  end
end
