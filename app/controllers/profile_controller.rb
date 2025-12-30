class ProfileController < ApplicationController
  before_action :authenticate_user!

  def show
    @user = current_user

    # Only players have match_results through associations (per your models)
    if @user.is_a?(User::Player)
      # Uses Match::Result scopes defined in matches/result.rb


      @matches_won  = Match::Result.won_by(@user).count
      @matches_lost = Match::Result.lost_by(@user).count
    end

    # Keep the view filename as profile.html.erb
    render 'profile/profile'
  end
end
