class CreateViewersMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :viewers_matches do |t|
      t.references :viewer, foreign_key: { to_table: :users }
      t.references :match, foreign_key: true
      t.timestamps
    end
  end
end
