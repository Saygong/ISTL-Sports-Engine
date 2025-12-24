class CreateMatchResultWinner < ActiveRecord::Migration[8.1]
  def change
    create_table :match_result_winners do |t|
      t.references :match_result, foreign_key: true
      t.references :user, foreign_key: true
      t.timestamps
    end
  end
end
