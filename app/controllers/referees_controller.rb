class RefereesController < ApplicationController
  before_action :authenticate_user!
  before_action :require_referee!

  #GET - Returns all tournament with matches that the user is referee of
  def show
    #@tournaments = Tournament.includes(:matches).with_match_refereed_by(current_user)
    @results_by_match_id = Match::Result.where(match_id: @tournaments.flat_map(&:matches).map(&:id)).index_by(&:match_id)
  end



  private
  def require_referee!
    unless current_user.is_a?(User::Referee)
      redirect_to root_path, alert: "You must be a referee to access the referee homepage."
    end
  end

end