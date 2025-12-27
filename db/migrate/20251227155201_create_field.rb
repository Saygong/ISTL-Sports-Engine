class CreateField < ActiveRecord::Migration[8.1]
  def change
    create_table :fields do |t|
      t.string :name
      t.string :description
      t.integer :surface, default: 0, null: false
      t.integer :max_seats
      t.integer :courts

      t.timestamps
    end
  end
end
