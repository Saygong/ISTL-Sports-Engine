class CreateMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :matches do |t|
      t.bigint :tournament_id, null: false
      t.date :ScheduledStart
      t.date :ScheduledEnd
      t.timestamps
    end

    add_foreign_key :matches, :tournaments, column: :tournament_id, primary_key: :id
  end
end
