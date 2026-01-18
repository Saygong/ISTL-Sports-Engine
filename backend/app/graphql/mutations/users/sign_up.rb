# frozen_string_literal: true

module Mutations
  module Users
    class SignUp < BaseMutation
      class AuthDataArgs < Types::BaseInputObject
        argument :email, GraphQL::Types::String, required: true
        argument :password, GraphQL::Types::String, required: true
        argument :password_confirmation, GraphQL::Types::String, required: true
      end

      class UserDataArgs < Types::BaseInputObject
        argument :first_name, String, required: true
        argument :last_name, String, required: true
        argument :birthdate, GraphQL::Types::ISO8601Date, required: true
        argument :gender, Types::Common::GenderEnumType, required: true
      end

      class SignUpArgs < Types::BaseInputObject
        argument :auth, AuthDataArgs, required: true
        argument :user, UserDataArgs, required: true
      end

      argument :args, SignUpArgs, required: true
      type Types::Users::SignActionType

      def resolve args:
        user = User::Player
               .create! email:                 args[:auth][:email],
                        password:              args[:auth][:password],
                        password_confirmation: args[:auth][:password_confirmation],
                        first_name:            args[:user][:first_name],
                        last_name:             args[:user][:first_name],
                        birthdate:             args[:user][:birthdate]

        Types::Users::SignActionType
          .to_h user, user.create_new_auth_token
      end
    end
  end
end
