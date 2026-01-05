class AddNextMatchToMatch < ActiveRecord::Migration[8.1]
  def change
    add_reference :matches, :match, foreign_key: true, null: true
  end
end
