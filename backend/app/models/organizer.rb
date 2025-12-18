class Organizer < AbstractUser
    validates :organization_name, :address, presence: true
    
end
