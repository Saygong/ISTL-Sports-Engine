class CreateMatch < ActiveRecord::Migration[8.1]
  def change
    create_table :matches do |t|
      t.references :referee, foreign_key: { to_table: :users }
      t.references :tournament, foreign_key: true
      t.datetime :date

      t.timestamps
    end
  end
end
