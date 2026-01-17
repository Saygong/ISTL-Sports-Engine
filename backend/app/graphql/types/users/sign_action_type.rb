# frozen_string_literal: true

module Types
  module Users
    class SignActionType < Types::BaseObject
      field :headers, HeadersType, null: false
      field :user, UserUnionType, null: false

      class << self
        def to_h user, headers
          {
            user:    user,
            headers: headers
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
