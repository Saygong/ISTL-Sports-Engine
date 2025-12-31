class CreateCourtFields < ActiveRecord::Migration[8.1]
  def change
    create_table :court_fields do |t|
      t.references :court, foreign_key: true
      t.string :name
      t.string :description
      t.integer :surface, default: 0, null: false
      t.integer :max_seats

      t.timestamps
    end
  end
end
