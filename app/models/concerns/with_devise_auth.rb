# frozen_string_literal: true

module WithDeviseAuth
  extend ActiveSupport::Concern

  included do
    # Include default devise modules.
    devise :database_authenticatable,
           :registerable,
           :recoverable,
           :rememberable,
           :validatable,
           :confirmable

    # noinspection RubyResolve
    before_create unless: :uid? do
      self.uid = email
    end
  end

end
