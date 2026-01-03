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
#  first_name             :string
#  last_name              :string
#  birthdate              :datetime
#  gender                 :integer          default(0), not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_data                  (data)
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_uid_and_provider      (uid,provider) UNIQUE
#
class User
  class Player < User
    has_many :players_teams, dependent: :destroy
    has_many :teams, through: :players_teams

    has_many :viewers_matches, dependent: :destroy, inverse_of: :viewer
    has_many :viewed_matches, through: :viewers_matches, source: :match

    # ...
    def join! tournament, team_id: nil
      tournament.with_lock do
        if Team.joinable_by(self).exists?
          # ...
          Team
            .joinable_by(self)
            .find(team_id)
            .players_teams
            .create! player: self
        else
          # ...
          Team.create! tournament:  tournament,
                       composition: tournament.composition,
                       players:     [self]
        end
      end
    end
  end
end
