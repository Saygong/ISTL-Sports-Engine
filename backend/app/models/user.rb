class User < AbstractUser
    validates :first_name, :last_name, :birth_date, presence: true
    validates :gender, length: { is: 1 }, presence: true

  # Returns the hash digest of the given string.
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end
end
