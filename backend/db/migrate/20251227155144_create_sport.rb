class CreateSport < ActiveRecord::Migration[8.1]
  def change
    create_table :sports do |t|
      t.string :description
      t.integer :variant_kind, default: 0, null: false
      t.integer :format_kind, default: 0, null: false
      t.integer :gender, default: 0, null: false
      t.datetime :min_age
      t.datetime :max_age

      t.timestamps
    end
  end
end
