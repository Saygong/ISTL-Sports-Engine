# frozen_string_literal: true

module Admin
  module ModelAttributes
    # All attributes for the resource used by the active admin.
    # @param except [Array<Symbol>]
    # @return [Array<Symbol>]
    def all_attributes except: [:id, :created_at, :updated_at]
      # Make sure both variable is Arrays
      except_a = except.to_a

      # Dynamic attribute discovery
      config
        .resource_class_name
        .constantize
        .column_names
        .map(&:to_sym)
        .reject { except_a.present? ? except_a.include?(it) : false }
    end
  end
end
