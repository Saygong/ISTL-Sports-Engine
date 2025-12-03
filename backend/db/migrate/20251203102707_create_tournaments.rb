class CreateTournaments < ActiveRecord::Migration[8.1]
  def change
    create_table :tournaments do |t|
      t.bigint :organizer_id, null: false
      t.string :Type, null: false
      t.bigint :AgeLimitation
      t.string :GenderLimitation, limit: 1
      t.date :StartDate

      t.timestamps
    end

    add_foreign_key :tournaments, :organizers, column: :organizer_id, primary_key: :id
    add_index :tournaments, :organizer_id
  end
end
