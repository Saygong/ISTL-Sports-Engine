class ChangeMinMaxAgeToSport < ActiveRecord::Migration[8.1]
  def change
    remove_column :sports, :min_age, :datetime
    remove_column :sports, :max_age, :datetime
    add_column :sports, :min_age, :integer
    add_column :sports, :max_age, :integer
  end
end
