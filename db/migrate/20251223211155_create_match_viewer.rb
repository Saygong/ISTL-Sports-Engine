class CreateMatchViewer < ActiveRecord::Migration[8.1]
  def change
    create_table :match_viewers do |t|
      t.references :match, foreign_key: true
      t.references :user, foreign_key: true
      t.timestamps
    end
  end
end
