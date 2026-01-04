# frozen_string_literal: true

module Tournaments
  module Seeding
    class Base
      def initialize tournament
        @tournament = tournament
      end

      def seed!
        @tournament.tap do |t|
          if seed? t
            t.transaction do
              before_seed t
              start_seed t
              after_seed t
            end
          end
        end
      end

      def seed? _tournament
        raise NoMethodError, "#{self.class.name} must override #{__method__}"
      end

      def before_seed tournament; end

      def start_seed _tournament
        raise NoMethodError, "#{self.class.name} must override #{__method__}"
      end

      def after_seed tournament; end
    end
  end
end
