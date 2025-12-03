class CreateMatchViewer < ActiveRecord::Migration[8.1]
  def change
    create_table :match_viewers do |t|
      t.bigint :match_id, null: false
      t.bigint :user_id, null: false

      t.timestamps
    end

    # Adding foreign key constraints
    add_foreign_key :match_viewers, :matches, column: :match_id, primary_key: :id
    add_foreign_key :match_viewers, :users, column: :user_id, primary_key: :id
  end
end
