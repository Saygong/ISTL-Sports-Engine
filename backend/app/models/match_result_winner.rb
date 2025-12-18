class MatchResultWinner < ApplicationRecord
    belongs_to :match_result
    has_a :user
end
