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
      @gender_options = Tournament.genders.keys
      @match_mode_options = Team.compositions.keys
      @referees = User::Referee.all
    end

    def create
      raise NoMethodError

      # Once the tournament is created, it redirects to the organizer dashboard
      redirect_to organizer_path
    end
  end
end
