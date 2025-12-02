class CreateMatchResultWinner < ActiveRecord::Migration[7.1]
  def change
    create_table :match_result_winner, id: false do |t|
      t.bigint :MatchWinnerID, primary_key: true

      t.bigint :MatchResultID, null: false
      t.bigint :UserID, null: false
    end

    add_foreign_key :match_result_winner, :match_result,
      column: :MatchResultID,
      primary_key: :MatchResultID

    add_foreign_key :match_result_winner, :users,
      column: :UserID,
      primary_key: :UserID
  end
end
