class ViewersMatchesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_match


  def create
    ViewersMatch.create!(
      match_id: @match,
      viewer_id: current_user
    )

    redirect_to @match, notice: "Match booked successfully."
  end

  def destroy
    viewers_match = ViewersMatch.find_by!(
      match_id: @match,
      viewer_id: current_user
    )

    viewers_match.destroy
    redirect_to @match, notice: "Booking removed."
  end

  private

  def set_match
    @match = Match.find(params[:match_id])
  end
end