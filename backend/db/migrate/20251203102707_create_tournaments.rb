class CreateTournaments < ActiveRecord::Migration[8.1]
  def change
    create_table :tournaments do |t|
      t.references :organizer, null: false, foreign_key: true

      t.string  :tournament_type, null: false
      t.bigint  :age_limitation
      t.string  :gender_limitation, limit: 1
      t.date    :start_date

      t.timestamps
    end

    add_index :tournaments, :organizer_id
  end
end
