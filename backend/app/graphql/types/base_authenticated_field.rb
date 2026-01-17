# frozen_string_literal: true

module Types
  class BaseAuthenticatedField < BaseField
    def initialize(*args, **kwargs, &)
      super
    end

    def authorized? obj, args, ctx
      return true if super && ctx[:current_user].present?

      raise ErrorsGQL::Unauthorized, I18n.t('errors.query.unauthorized')
    end
  end
end
