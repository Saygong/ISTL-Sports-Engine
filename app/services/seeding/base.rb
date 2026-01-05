# frozen_string_literal: true

module Seeding
  class Base
    def seed! record
      record.tap do
        if seed? record
          record.transaction do
            before_seed record
            start_seed record
            after_seed record
          end
        end
      end
    end

    def seed? _record
      true
    end

    def before_seed record; end

    def start_seed _record
      raise NoMethodError, "#{self.class.name} must override #{__method__}"
    end

    def after_seed record; end
  end
end
