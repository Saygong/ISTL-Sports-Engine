class Match < ApplicationRecord
    belongs_to :tournament
    validates :scheduled_start :scheduled_end, presence: true

end
