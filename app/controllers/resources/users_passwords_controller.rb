# frozen_string_literal: true

module Resources
  class UsersPasswordsController < Devise::PasswordsController
    protected def after_sending_reset_password_instructions_path_for _
      # noinspection RubyResolve
      passwords_new_resources_user_path
    end
  end
end