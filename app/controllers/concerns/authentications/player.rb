# frozen_string_literal: true

module Authentications
  module Player
    extend ActiveSupport::Concern

    class_methods do
      def require_player!(*args, **kwargs)
        before_action(*args, **kwargs) do
          unless current_user.is_a?(User::Player)
            redirect_to root_path, alert: I18n.t('errors.controllers.players.unauthorized')
          end
        end
      end
    end
  end
end
