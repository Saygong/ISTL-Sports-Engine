# frozen_string_literal: true

module Resources
  class TournamentsController < ApplicationController
    def index

    end

    def show
      @tournament = Tournament.find(params[:id])
    end
  end
end
