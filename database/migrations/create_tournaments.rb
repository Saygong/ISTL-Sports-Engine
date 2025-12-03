class CreateTournaments < ActiveRecord::Migration[7.1]
  def change
    create_table :tournaments, id: false do |t|
      t.bigint :TournamentID, primary_key: true
      t.bigint :OrganizerID, null: false

      t.string :Type, null: false
      t.bigint :AgeLimitation
      t.string :GenderLimitation, limit: 1
      t.date :StartDate, null: false
      t.timestamps
    end

    add_foreign_key :tournaments, :organizers, column: :OrganizerID, primary_key: :OrganizerID
    add_index :tournaments, :OrganizerID
  end
end
