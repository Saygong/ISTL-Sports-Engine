class CreateTeam < ActiveRecord::Migration[8.1]
  def change
    create_table :teams do |t|
      t.references :tournament, foreign_key: true
      t.string :name
      t.integer :composition, default: 0, null: false
      t.timestamps
    end
  end
end
