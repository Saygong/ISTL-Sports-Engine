class RemoveGenderMinMaxAgeFromSport < ActiveRecord::Migration[8.1]
  def change
    remove_column :sports, :max_age, :integer
    remove_column :sports, :min_age, :integer
    remove_column :sports, :gender, :integer, default: 0, null: false
  end
end
