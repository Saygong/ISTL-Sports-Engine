class RemoveFormatKindFromSport < ActiveRecord::Migration[8.1]
  def change
    remove_column :sports, :format_kind, :integer, default: 0, null: false
  end
end
