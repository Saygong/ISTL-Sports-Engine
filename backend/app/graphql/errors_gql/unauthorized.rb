# frozen_string_literal: true

module ErrorsGQL
  class Unauthorized < Base
    def initialize message, ast_node: nil, options: nil, extensions: nil
      super
    end
  end
end
