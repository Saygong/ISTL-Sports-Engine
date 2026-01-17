# frozen_string_literal: true

module Mutations
  module Users
    class SignIn < BaseMutation
      class SignInArgs < Types::BaseInputObject
        argument :email, String, required: true
        argument :password, String, required: true
      end

      argument :args, SignInArgs, required: true
      type Types::Users::SignActionType

      def resolve args:
        User
          .find_by(email: args[:email])
          .then do |user|
            raise ErrorsGQL::SignIn, I18n.t('errors.mutations.sign_in') unless user
            raise ErrorsGQL::SignIn, I18n.t('errors.mutations.sign_in') unless user.valid_password? args[:password]

            Types::Users::SignActionType
              .to_h user, user.create_new_auth_token
          end
      end
    end
  end
end
