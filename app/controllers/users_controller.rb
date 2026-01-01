# frozen_string_literal: true

class UsersController < ApplicationController
  # To view shared links provided by Devise
  # [https://github.com/heartcombo/devise/wiki/How-To:-Display-a-custom-sign_in-form-anywhere-in-your-app]
  helper_method :resource_name, :resource, :devise_mapping, :resource_class

  before_action :authenticate_user!,
                only: [:profile]

  # before_action :authenticate_user!, only: [:show]

  # def show
  #   @user = current_user
  #
  #   # Only players have match_results through associations (per your models)
  #   if @user.is_a?(User::Player)
  #     # Uses Match::Result scopes defined in matches/result.rb
  #
  #     @matches_won  = Match::Result.won_by(@user).count
  #     @matches_lost = Match::Result.lost_by(@user).count
  #   end
  #
  #   # Keep the view filename as profile.html.erb
  #   render 'profile/profile'
  # end

  # def homepage
  #   # ChatGPT suggest me to create on the model a function eligible_for?
  #   @tournaments = Tournament.All
  # end

  def unconfirmed
    # Nothing to do
  end

  def passwords
    # Nothing to do
  end

  # Controller action for the user profile page.
  def profile
    @user = current_user

    # Check if the registered user is a player (STI)
    if current_user.is_a? User::Player
      # noinspection RubyResolve
      @matches_won = Match::Result.won_by(current_user).count
      @matches_lost = Match::Result.lost_by(current_user).count
    end
  end

  private

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def resource_class
    User
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end
end
