class MatchViewer < ApplicationRecord
    has_a :match, :user
end
