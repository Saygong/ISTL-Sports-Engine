# frozen_string_literal: true

module Authentications
  module Referee
    extend ActiveSupport::Concern

    class_methods do
      def require_referee!(*, **)
        before_action(*, **) do
          unless current_user.is_a?(User::Referee)
            redirect_to root_path, alert: I18n.t('errors.controllers.referees.unauthorized')
          end
        end
      end
    end
  end
end
