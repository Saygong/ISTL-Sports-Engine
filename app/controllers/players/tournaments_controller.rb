# frozen_string_literal: true

module Players
  class TournamentsController < ApplicationController
    include Authentications::Player

    before_action :authenticate_user!
    require_player!

    # ...
    def show
      @tournament = Tournament.find(params[:id])
      @eligible = current_user.eligible_for? @tournament
      @is_individual = @tournament.single?
      @is_registered = current_user.joined? @tournament
    end

    def join
      raise NoMethodError

      redirect_to player_tournament_path
    end
  end
end
