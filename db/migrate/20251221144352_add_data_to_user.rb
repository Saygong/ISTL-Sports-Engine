class AddDataToUser < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :data, :jsonb, default: {}, null: false

    # Add a GIN index to speed up JSONB queries
    add_index :users, :data, using: :gin
  end
end
