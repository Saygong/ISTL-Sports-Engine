# frozen_string_literal: true

module Resources
  class UsersRegistrationsController < Devise::RegistrationsController
    def build_resource hash = {}
      # This forces the resulting object to be an instance of User::Player, since it is the only kind of us er that can
      # register autonomously.
      hash[:type] = 'User::Player'
      super
    end

    # If the account that is registered is confirmable and not active yet, you have to override
    # +after_inactive_sign_up_path_for+ method.
    # [https://github.com/heartcombo/devise/wiki/How-Tos]
    protected def after_inactive_sign_up_path_for resource
      # noinspection RubyResolve
      return unconfirmed_new_resources_user_path unless resource.confirmed?

      super
    end
  end
end
