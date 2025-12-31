class AddNumberOfMatchesToTournament < ActiveRecord::Migration[8.1]
  def change
    add_column :tournaments, :number_of_matches, :integer
  end
end
