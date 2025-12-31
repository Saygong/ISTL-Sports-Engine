class DropPlayersTournaments < ActiveRecord::Migration[8.1]
  def change
    drop_table :players_tournaments do |t|
      t.references :player, foreign_key: { to_table: :users }
      t.references :tournament, foreign_key: true
      t.timestamps
    end
  end
end
