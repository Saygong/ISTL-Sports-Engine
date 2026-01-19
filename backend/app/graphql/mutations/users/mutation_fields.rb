# frozen_string_literal: true

module Mutations
  module Users
    module MutationFields
      def self.included base
        base.instance_exec do
          field :sign_out, mutation: SignOut
          field :sign_up, mutation: SignUp
          field :sign_in, mutation: SignIn
        end
      end
    end
  end
end
