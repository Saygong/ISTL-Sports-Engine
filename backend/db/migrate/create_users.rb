class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :FirstName, null: false
      t.string :LastName, null: false
      t.date   :BirthDate, null: false
      t.string :Email, null: false
      t.string :PasswordHash, null: false
      t.string :Gender, limit: 1, null: false

      t.timestamps
    end
  end
end
