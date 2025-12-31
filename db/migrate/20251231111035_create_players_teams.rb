class CreatePlayersTeams < ActiveRecord::Migration[8.1]
  def change
    create_table :players_teams do |t|
      t.references :player, foreign_key: { to_table: :users }
      t.references :team, foreign_key: true
      t.timestamps
    end
  end
end
