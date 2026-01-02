class Matches::ResultsController < ApplicationController
  before_action :authenticate_user!
  before_action :require_referee!

  def new
    @match = Match.includes(:teams).find(params[:id])
  end

  def create; end

  private

  def require_referee!
    return if current_user.is_a?(User::Referee)

    redirect_to root_path, alert: 'You must be a referee to access the referee homepage.'
  end
end
