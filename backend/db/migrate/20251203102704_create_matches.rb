class CreateMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :matches do |t|
      t.bigint :tournament_id, null: false
      t.date :scheduled_start
      t.date :scheduled_end
      t.timestamps
    end

    add_foreign_key :matches, :tournaments, column: :tournament_id, primary_key: :id
  end
end
