# frozen_string_literal: true


class TournamentsController < ApplicationController
  before_action :authenticate_user!, only: [:subscribe, :unsubscribe]
  before_action :require_organizer!, only: [:new, :create]

  # GET - Display a list of all tournaments
  def index
    @tournaments = Tournament.all
  end

  # Lista tornei di cui è organizzatore e tutti i dati di tutte i match



  # GET - Display form page for creating a new tournament
  def new
    @sports = Sport.all
    @fields = Field.owned_fields(current_user) #TODO
    @referees = User::Referee.all
  end

  # POST - Create a new tournament
  def create
    @tournament = Tournament.new(params)
    Tournament.build_matches(params) #TODO
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

  #POST - Subscribe the user to a specific tournament
  def subscribe

    #Check if tournament is not empty and if user respect limitations, if controls pass then create new PlayersTournament
    @subscription = PlayersTournament.subscribe(current_user, params[:id]) #TODO
    if @subscription
      render :show/params[:id], notice: "Correctly subscribed!"
    else
      render :players_tournaments, notice: "Impossible to subscribe to this tournament"
    end
  end

  def unsubscribe
    PlayersTournament.unsubscribe(current_user, params[:id]) #TODO
  end


  private

  def require_organizer!
    unless current_user.is_a?(User::Organizer)
      redirect_to root_path, alert: "You must be an organizer to create a tournament."
    end
  end

end
