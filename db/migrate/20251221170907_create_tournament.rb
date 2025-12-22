class CreateTournament < ActiveRecord::Migration[8.1]
  def change
    create_table :tournaments do |t|
      t.references :user, foreign_key: true
      t.integer :sport, default: 0
      t.integer :gender, default: 0, null: false
      t.datetime :min_birthdate
      t.datetime :max_birthdate
      t.datetime :start_date

      t.timestamps
    end
  end
end
