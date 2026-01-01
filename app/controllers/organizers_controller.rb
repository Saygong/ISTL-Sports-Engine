class OrganizersController < ApplicationController
  include Authentications::Organizer

  before_action :authenticate_user!

  require_organizer! only: [:show]

  # Controller action to display the dashboard page for the connected organizer.
  def show
    # noinspection RailsParamDefResolve
    @tournaments = current_user
                     .tournaments
                     .includes(:matches)
                     .order(start_date: :asc)

    # Extract all matches from the tournament list and retrieve the corresponding results
    @tournaments
      .map(&:matches)
      .flatten
      .then { |matches| @results_by_match_id = Match::Result.where(match: matches) }
  end

  def profile
    redirect_to profile_user_path
  end
end
