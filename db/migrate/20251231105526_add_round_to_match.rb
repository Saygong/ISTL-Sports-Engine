class AddRoundToMatch < ActiveRecord::Migration[8.1]
  def change
    add_column :matches, :round, :integer
  end
end
