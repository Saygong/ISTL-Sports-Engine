# frozen_string_literal: true

module Mutations
  module Users
    class SignIn < BaseMutation
      class SignInArgs < Types::BaseInputObject
        argument :email, String, required: true
        argument :password, String, required: true
      end

      argument :args, SignInArgs, required: true
      type Types::Users::SignInType

      def resolve args:
        User
          .find_by(email: args[:email])
          .then do |user|
            raise ErrorsGQL::SignIn, I18n.t('errors.mutations.sign_in') unless user
            raise ErrorsGQL::SignIn, I18n.t('errors.mutations.sign_in') unless user.valid_password? args[:password]

            {
              user:    user,
              headers: user
                .create_new_auth_token
                .then do |hash|
                  {
                    access_token:  hash['access-token'],
                    token_type:    hash['token-type'],
                    client:        hash['client'],
                    expiry:        hash['expiry'],
                    uid:           hash['uid'],
                    authorization: hash['Authorization']
                  }
                end
            }
          end
      end
    end
  end
end
