class CreateOrganizers < ActiveRecord::Migration[7.1]
  def change
    create_table :organizers, id: false do |t|
      t.bigint :OrganizerID, primary_key: true
      t.string :OrganizationName, null: false
      t.string :Address, null: false
    end
  end
end
