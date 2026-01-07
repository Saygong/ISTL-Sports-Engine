# frozen_string_literal: true

module Organizers
  class TournamentsController < ApplicationController
    include Authentications::Organizer

    before_action :authenticate_user!
    require_organizer!

    # Initialize the data for the Tournament form.
    def new
      @tournament = Tournament.new
      @sports = Sport.all
      @courts = Court.all
      @composition_options = Tournament.compositions.keys
      @gender_options = Tournament.genders.keys
      @match_mode_options = Team.compositions.keys
      @referees = User::Referee.all
    end

    def create
      User::Referee
        .find(params[:referee_ids].compact_blank)
        .then do |referees|
          params[:tournament].then do |tournament|
            # noinspection RubyMismatchedArgumentType
            Tournament.create! organizer:         current_user,
                               name:              tournament[:name],
                               sport:             Sport.find(tournament[:sport_id].to_i),
                               start_date:        Date.parse(tournament[:start_date].to_s),
                               court:             Court.find(tournament[:court_id].to_i),
                               min_age:           tournament[:min_age].to_i,
                               max_age:           tournament[:max_age].to_i,
                               gender:            :"#{tournament[:gender]}",
                               composition:       :"#{tournament[:composition]}",
                               number_of_matches: tournament[:number_of_matches].to_i,
                               referees:          referees
          end
        end

      # Once the tournament is created, it redirects to the organizer dashboard
      redirect_to organizer_path
    end
  end
end
