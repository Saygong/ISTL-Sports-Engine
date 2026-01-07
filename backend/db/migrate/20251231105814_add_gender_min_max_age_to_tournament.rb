class AddGenderMinMaxAgeToTournament < ActiveRecord::Migration[8.1]
  def change
    add_column :tournaments, :max_age, :integer
    add_column :tournaments, :min_age, :integer
    add_column :tournaments, :gender, :integer, default: 0, null: false
  end
end
