class PlayersTournamentsController < ApplicationController
  before_action :require_authentication!


  #GET - Show all tournaments the current user is subscribed to
  def index
    @tournaments = Tournament.subscribed_to(current_user) #TODO
  end


  def unsubscribe

    PlayersTournament.unsubscribe(current_user, params[:id]) #TODO

  end


end