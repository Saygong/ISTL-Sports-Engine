class CreateMatchPlayer < ActiveRecord::Migration[7.1]
  def change
    create_table :match_player, id: false do |t|
      t.bigint :MatchPlayerID, primary_key: true
      t.bigint :MatchID, null: false
      t.bigint :UserID, null: false
    end

    # Adding foreign key constraints
    add_foreign_key :match_player, :Matches, column: :MatchID, primary_key: :MatchID
    add_foreign_key :match_player, :Users, column: :UserID, primary_key: :UserID
  end
end
