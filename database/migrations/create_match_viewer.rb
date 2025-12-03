class CreateMatchViewer < ActiveRecord::Migration[7.1]
  def change
    create_table :match_viewer, id: false do |t|
      t.bigint :MatchViewerID, primary_key: true
      t.bigint :MatchID, null: false
      t.bigint :UserID, null: false
      t.timestamps
    end

    # Adding foreign key constraints
    add_foreign_key :match_viewer, :Matches, column: :MatchID, primary_key: :MatchID
    add_foreign_key :match_viewer, :Users, column: :UserID, primary_key: :UserID
  end
end
