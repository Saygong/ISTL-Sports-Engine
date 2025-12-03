class CreateOrganizers < ActiveRecord::Migration[8.1]
  def change
    create_table :organizers do |t|
      t.string :OrganizationName
      t.string :Address

      t.timestamps
    end
  end
end
