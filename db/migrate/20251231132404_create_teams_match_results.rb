class CreateTeamsMatchResults < ActiveRecord::Migration[8.1]
  def change
    create_table :teams_match_results do |t|
      t.references :team, foreign_key: true
      t.references :match_result, foreign_key: true
      t.integer :team_status, null: false
      t.timestamps
    end
  end
end
