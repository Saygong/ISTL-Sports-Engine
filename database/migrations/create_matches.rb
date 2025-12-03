class CreateMatches < ActiveRecord::Migration[7.1]
  def change
    create_table :matches, id: false do |t|
      t.bigint :MatchID, primary_key: true
      t.bigint :TournamentID, null: false

      t.date :ScheduledStart, null: false
      t.date :ScheduledEnd, null: false
      t.timestamps
    end

    add_foreign_key :matches, :tournaments, column: :TournamentID, primary_key: :TournamentID
  end
end
