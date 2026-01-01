class RefereesController < ApplicationController
  before_action :authenticate_user!

  before_action only: [:show] do
    unless current_user.is_a?(User::Referee)
      redirect_to root_path, alert: I18n.t('errors.controllers.referees.unauthorized')
    end
  end

  # GET - Returns all tournament with matches that the user is referee of
  def show
    # @tournaments = Tournament.includes(:matches).with_match_refereed_by(current_user)
    @results_by_match_id = Match::Result.where(match_id: @tournaments.flat_map(&:matches).map(&:id)).index_by(&:match_id)
  end

  def profile
    redirect_to profile_user_path
  end
end
