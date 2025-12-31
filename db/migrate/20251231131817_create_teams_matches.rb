class CreateTeamsMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :teams_matches do |t|
      t.references :team, foreign_key: true
      t.references :match, foreign_key: true
      t.timestamps
    end
  end
end
