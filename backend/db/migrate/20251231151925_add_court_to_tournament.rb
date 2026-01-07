class AddCourtToTournament < ActiveRecord::Migration[8.1]
  def change
    add_reference :tournaments, :court, foreign_key: true
  end
end
