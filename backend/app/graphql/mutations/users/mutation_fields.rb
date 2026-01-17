# frozen_string_literal: true

module Mutations
  module Users
    module MutationFields
      def self.included base
        base.instance_exec do
          field :sign_out, mutation: SignOut

          with_options role: nil do
            field :sign_up, mutation: SignUp, role: nil
            field :sign_in, mutation: SignIn, role: nil
          end
        end
      end
    end
  end
end
