# frozen_string_literal: true

module Overrides
  module Devise
    class PasswordsController < ::Devise::PasswordsController
      protected def after_sending_reset_password_instructions_path_for _
        # noinspection RubyResolve
        passwords_user_path
      end
    end
  end
end
