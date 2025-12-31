class DropField < ActiveRecord::Migration[8.1]
  def change
    drop_table :fields do |t|
      t.string :name
      t.string :description
      t.integer :surface, default: 0, null: false
      t.integer :max_seats

      t.timestamps
    end
  end
end
