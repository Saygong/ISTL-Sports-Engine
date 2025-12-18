class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.date   :birth_date, null: false
      t.string :email, null: false
      t.string :password, null: false
      t.string :gender, limit: 1, null: false
      t.string :type

      t.timestamps
    end
  end
end
