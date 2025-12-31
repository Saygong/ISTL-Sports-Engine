class RemoveFieldFromTournament < ActiveRecord::Migration[8.1]
  def change
    remove_index :tournaments, :field_id
    remove_foreign_key :tournaments, :fields
  end
end
