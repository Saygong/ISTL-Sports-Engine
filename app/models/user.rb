# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  uid                    :string           default(""), not null
#  provider               :string           default("email"), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  allow_password_change  :boolean          default(FALSE)
#  remember_created_at    :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  tokens                 :json
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  type                   :string           default("User")
#  data                   :jsonb            default("{}"), not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_data                  (data)
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_uid_and_provider      (uid,provider) UNIQUE
#
class User < ApplicationRecord
  # Include default devise modules.
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :confirmable

  # Model Integration for for DeviseTokenAuth.
  # Typical use of this gem will not require the use of any of the following model methods. All authentication should be
  # handled invisibly by the controller concerns.
  # [https://devise-token-auth.gitbook.io/devise-token-auth/usage/model_concerns]
  # include DeviseTokenAuth::Concerns::User

  # ActiveRecord::Store gives you a thin wrapper around serialize for the purpose of storing hashes in a single column.
  # Every accessor comes with dirty tracking methods.
  # The default validations with the exception of uniqueness will work.
  store_accessor :data,
                 :first_name,
                 :last_name,
                 :birthdate,
                 :gender
end
