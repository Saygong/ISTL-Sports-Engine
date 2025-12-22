class CreateMatchResult < ActiveRecord::Migration[8.1]
  def change
    create_table :match_results do |t|
      t.references :match, foreign_key: true
      t.references :user, foreign_key: true
      t.string :description
      t.timestamps
    end
  end
end
