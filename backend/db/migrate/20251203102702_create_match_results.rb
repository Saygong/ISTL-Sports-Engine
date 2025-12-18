class CreateMatchResult < ActiveRecord::Migration[8.1]
  def change
    create_table :match_results do |t|
      t.bigint :match_id, null: false
      t.string :score_text, null: false
      t.bigint :recorded_by_referee, null: false

      t.timestamps
    end

    add_foreign_key :match_results, :matches, column: :match_id, primary_key: :id
    add_foreign_key :match_results, :referees, column: :RecordedByReferee, primary_key: :id
  end
end
