class CreateReferees < ActiveRecord::Migration[8.1]
  def change
    create_table :referees do |t|
      t.string :QualificationLevel
      t.string :Availability

      t.timestamps
    end
  end
end
