class CreateTournament < ActiveRecord::Migration[8.1]
  def change
    create_table :tournaments do |t|
      t.string :name
      t.string :description
      t.datetime :start_date
      t.datetime :end_date
      t.references :organizer, null: true, foreign_key: { to_table: :users }
      t.references :sport, foreign_key: true
      t.references :field, foreign_key: true

      t.timestamps
    end
  end
end
