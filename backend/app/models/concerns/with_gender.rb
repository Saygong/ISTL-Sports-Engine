# frozen_string_literal: true

module WithGender
  extend ActiveSupport::Concern

  included do
    enum :gender, {
      male:   0,
      female: 1
    }
  end
end
