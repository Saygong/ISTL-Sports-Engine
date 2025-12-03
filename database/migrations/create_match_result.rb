class CreateMatchResult < ActiveRecord::Migration[7.1]
  def change
    create_table :match_result, id: false do |t|
      t.bigint :MatchResultID, primary_key: true

      t.bigint :MatchID, null: false
      t.string :ScoreText, null: false
      t.bigint :RecordedByRefereeID, null: false
      t.timestamps
    end

    add_foreign_key :match_result, :matches,
      column: :MatchID,
      primary_key: :MatchID

    add_foreign_key :match_result, :referees,
      column: :RecordedByRefereeID,
      primary_key: :RefereeID
  end
end
