class CreateReferees < ActiveRecord::Migration[7.1]
  def change
    create_table :referees, id: false do |t|
      t.bigint :RefereeID, primary_key: true
      t.string :QualificationLevel, null: false
      t.string :Availability, null: false
    end
  end
end
