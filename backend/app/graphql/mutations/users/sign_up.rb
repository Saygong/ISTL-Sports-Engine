# frozen_string_literal: true

module Mutations
  module Users
    class SignUp < BaseMutation
      class SignUpArgs < Types::BaseInputObject
        argument :email, String, required: true
        argument :password, String, required: true
        argument :password_confirmation, String, required: true
      end

      argument :args, SignUpArgs, required: true
      type Types::Users::SignActionType

      def resolve args:
        user = User::Player
               .create! email:                 args[:email],
                        password:              args[:password],
                        password_confirmation: args[:password_confirmation]

        Types::Users::SignActionType
          .to_h user, user.create_new_auth_token
      end
    end
  end
end
