# frozen_string_literal: true

module Authentications
  module Organizer
    extend ActiveSupport::Concern

    class_methods do
      def ensure_organizer!(*args, **kwargs)
        before_action(*args, **kwargs) do
          unless current_user.is_a?(User::Organizer)
            redirect_to root_path, alert: I18n.t('errors.controllers.organizers.unauthorized')
          end
        end
      end
    end
  end
end
