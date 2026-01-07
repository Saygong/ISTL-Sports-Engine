class CreatePlayersMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :players_matches do |t|
      t.references :player, foreign_key: { to_table: :users }
      t.references :match, foreign_key: true
      t.timestamps
    end
  end
end
