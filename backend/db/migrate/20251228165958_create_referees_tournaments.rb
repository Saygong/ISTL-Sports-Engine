class CreateRefereesTournaments < ActiveRecord::Migration[8.1]
  def change
    create_table :referees_tournaments do |t|
      t.references :referee, foreign_key: { to_table: :users }
      t.references :tournament, foreign_key: true
      t.timestamps
    end
  end
end
