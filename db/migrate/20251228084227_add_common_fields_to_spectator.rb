class AddCommonFieldsToSpectator < ActiveRecord::Migration[8.1]
  def change
    add_column :spectators, :first_name, :string
    add_column :spectators, :last_name, :string
    add_column :spectators, :birthdate, :datetime
    add_column :spectators, :gender, :integer, default: 0, null: false
  end
end
