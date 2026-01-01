# frozen_string_literal: true

class PlayersController < ApplicationController
  include Authentications::Player

  before_action :authenticate_user!
  require_player! only: [:show]

  def show
    @sports = Sport.all

    # Launch a functional chain to filter tournaments based on user-provided parameters.
    Tournament
      .all
      .then { params[:name].present? ? it.where(name: params[:name]) : it }
      .then { params[:sport].present? ? it.where(sport_id: params[:sport]) : it }
      .then { @tournaments = it }
  end

  def profile
    redirect_to profile_user_path
  end
end
