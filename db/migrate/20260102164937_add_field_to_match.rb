class AddFieldToMatch < ActiveRecord::Migration[8.1]
  def change
    add_reference :matches, :court_field, foreign_key: true
  end
end
