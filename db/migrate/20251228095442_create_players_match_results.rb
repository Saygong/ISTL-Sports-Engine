class CreatePlayersMatchResults < ActiveRecord::Migration[8.1]
  def change
    create_table :players_match_results do |t|
      t.references :player, foreign_key: { to_table: :users }
      t.references :match_result, foreign_key: true
      t.integer :player_status, default: 0, null: false
      t.timestamps
    end
  end
end
