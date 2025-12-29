# frozen_string_literal: true

module Resources
  class UsersController < ApplicationController
    # before_action :authenticate_user!

    # To view shared links provided by Devise
    # [https://github.com/heartcombo/devise/wiki/How-To:-Display-a-custom-sign_in-form-anywhere-in-your-app]
    helper_method :resource_name, :resource, :devise_mapping, :resource_class

    def unconfirmed
      # Nothing to do
    end

    def passwords
      # Nothing to do
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
end
