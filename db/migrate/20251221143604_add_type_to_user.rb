class AddTypeToUser < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :type, :string, default: 'User'
  end
end
