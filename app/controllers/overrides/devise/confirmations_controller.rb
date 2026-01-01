# frozen_string_literal: true

module Overrides
  module Devise
    class ConfirmationsController < ::Devise::ConfirmationsController
      protected def after_resending_confirmation_instructions_path_for _
        # noinspection RubyResolve
        unconfirmed_user_path
      end
    end
  end
end
