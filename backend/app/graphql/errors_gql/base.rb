# frozen_string_literal: true

module ErrorsGQL
  class Base < GraphQL::ExecutionError
    def initialize message, ast_node: nil, options: nil, extensions: nil
      # noinspection RubyArgCount
      (extensions || {})
        .merge({ code: self.class.name.demodulize.underscore.upcase })
        .then { super(message, ast_node: ast_node, options: options, extensions: it) }
    end
  end
end
