# frozen_string_literal: true

module Types
  module Users
    class HeadersType < Types::BaseObject
      field :access_token, String, null: false
      field :token_type, String, null: false
      field :client, String, null: false
      field :expiry, Int, null: false
      field :uid, String, null: false
      field :authorization, String, null: false
    end
  end
end
