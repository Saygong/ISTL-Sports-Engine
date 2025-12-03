class CreateMatchPlayer < ActiveRecord::Migration[8.1]
  def change
    create_table :match_players do |t|
      t.bigint :match_id, null: false
      t.bigint :user_id, null: false
      
      t.timestamps
    end

    # Adding foreign key constraints
    add_foreign_key :match_players, :matches, column: :match_id, primary_key: :id
    add_foreign_key :match_players, :users, column: :user_id, primary_key: :id
  end
end
