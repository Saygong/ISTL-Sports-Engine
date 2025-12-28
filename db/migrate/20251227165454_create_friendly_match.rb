class CreateFriendlyMatch < ActiveRecord::Migration[8.1]
  def change
    create_table :friendly_matches do |t|
      t.references :player, foreign_key: { to_table: :users }
      t.references :sport, foreign_key: true
      t.references :field, foreign_key: true
      t.datetime :date
      t.timestamps
    end
  end
end
