class CreateMatch < ActiveRecord::Migration[8.1]
  def change
    create_table :matches do |t|
      t.references :tournament, foreign_key: true
      t.datetime :start_at
      t.datetime :end_at
      t.timestamps
    end
  end
end
