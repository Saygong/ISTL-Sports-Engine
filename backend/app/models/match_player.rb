class MatchPlayer < ApplicationRecord
    has_a :match, :user
end
