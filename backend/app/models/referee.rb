class Referee < AbstractUser
    validates :qualification_level, :availability, presence: true

end
