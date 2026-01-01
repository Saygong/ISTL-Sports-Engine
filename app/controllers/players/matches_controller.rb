# frozen_string_literal: true

module Players
  class MatchesController < ApplicationController
    include Authentications::Player

    before_action :authenticate_user!
    require_player!

    def index
      @matches = current_user.viewed_matches
    end

    def book
      raise NoMethodError
      redirect_to player_matches_path
    end

    def unbook
      raise NoMethodError
      redirect_to player_matches_path
    end
  end
end
