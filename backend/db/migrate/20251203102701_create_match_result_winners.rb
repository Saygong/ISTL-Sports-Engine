class CreateMatchResultWinner < ActiveRecord::Migration[8.1]
  def change
    create_table :match_result_winners do |t|
      t.bigint :match_result_id, null: false
      t.bigint :user_id, null: false

      t.timestamps
    end

    add_foreign_key :match_result_winners, :match_results, column: :match_result_id, primary_key: :id
    add_foreign_key :match_result_winners, :users, column: :user_id, primary_key: :id
  end
end