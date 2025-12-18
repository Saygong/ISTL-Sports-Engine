class MatchResult < ApplicationRecord
    belongs_to :match
    has_a :referee

    validates :score_text
end
