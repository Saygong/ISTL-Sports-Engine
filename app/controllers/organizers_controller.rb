class OrganizersController < ApplicationController
  before_action :authenticate_user!
  before_action :require_organizer!

  def show
    @tournaments = Tournament.includes(:matches).organized_by(current_user).order(start_date: :asc)
  end



  private
  def require_organizer!
    unless current_user.is_a?(User::Organizer)
      redirect_to root_path, alert: "You must be an organizer to access the organizer homepage."
    end
  end

end