# frozen_string_literal: true

module Types
  class BaseAuthenticatedField < BaseField
    def initialize(*args, role: :base, **kwargs, &)
      @role = role

      super
    end

    def authorized? obj, args, ctx
      auth_procs = {
        base:      proc { ctx[:current_user].present? },
        player:    proc { ctx[:current_user].is_a? User::Player },
        organizer: proc { ctx[:current_user].is_a? User::Organizer },
        referee:   proc { ctx[:current_user].is_a? User::Referee }
      }

      if @role.present?
        return true if super && auth_procs[@role]&.call
      elsif super
        return true
      end

      raise ErrorsGQL::Unauthorized, I18n.t('errors.query.unauthorized')
    end
  end
end
