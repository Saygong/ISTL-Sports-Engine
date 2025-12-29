# frozen_string_literal: true

module Resources
  class UsersConfirmationsController < Devise::ConfirmationsController
    protected def after_resending_confirmation_instructions_path_for _
      # noinspection RubyResolve
      unconfirmed_new_resources_user_path
    end
  end
end