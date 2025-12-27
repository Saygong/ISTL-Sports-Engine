class CreatePlayersFriendlyMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :players_friendly_matches do |t|
      t.references :player, foreign_key: { to_table: :users }
      t.references :friendly_match, foreign_key: true

      t.timestamps
    end
  end
end
