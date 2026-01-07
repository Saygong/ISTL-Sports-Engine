# frozen_string_literal: true

module WithComposition
  extend ActiveSupport::Concern

  included do
    enum :composition, {
      single: 0,
      double: 1
    }
  end
end
