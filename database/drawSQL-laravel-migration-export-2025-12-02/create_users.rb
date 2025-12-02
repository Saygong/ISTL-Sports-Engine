class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users, id: false do |t|
      t.bigint :UserID, primary_key: true
      t.string :FirstName, null: false
      t.string :LastName, null: false
      t.date   :BirthDate, null: false
      t.string :Email, null: false
      t.string :PasswordHash, null: false
      t.string :Gender, limit: 1, null: false
    end

    add_index :users, :Email, unique: false   # Laravel did not specify unique
  end
end
