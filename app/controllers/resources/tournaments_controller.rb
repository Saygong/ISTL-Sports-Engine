# frozen_string_literal: true

module Resources
  class TournamentsController < ApplicationController
    before_action :authenticate_user!
    before_action :require_organizer!, only: [new, create]

    # GET - Display a list of all tournaments
    def index
      @tournaments = Tournament.all.order(start_date: :asc)
    end

    # GET - Display form page for creating a new tournament
    def new
      @sports = Sport.all
      @fields = Field.owned_fields(current_user)
    end

    # POST - Create a new tournament
    def create
      @tournament = Tournament.new(tournament_params)

      if @tournament.save
        redirect_to @tournament, notice: "Tournament created successfully."
      else
        render :new, status: :unprocessable_entity
      end
    end

    # GET - Show a specific tournament given a tournament id
    def show
      @tournament = Tournament.find(params[:id])
    end


    private

    def require_organizer!
      unless current_user.is_a?(User::Organizer)
        redirect_to root_path, alert: "You must be an organizer to create a tournament."
      end
    end


  end
end
