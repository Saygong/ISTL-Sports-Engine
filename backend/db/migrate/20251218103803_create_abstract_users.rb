class CreateAbstractUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :abstract_users do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.date   :birth_date, null: false
      t.string :email, null: false
      t.string :password, null: false
      t.string :gender, limit: 1, null: false
      t.string :qualification_level
      t.string :availability
      t.string :organization_name
      t.string :address
      
      t.timestamps
    end

    add_index :abstract_users, :email, unique: true
    add_index :abstract_users, :type
   
  end
end
