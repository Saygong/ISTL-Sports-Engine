# frozen_string_literal: true

# == Schema Information
#
# Table name: court_fields
#
#  id          :integer          not null, primary key
#  court_id    :integer
#  name        :string
#  description :string
#  surface     :integer          default(0), not null
#  max_seats   :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_court_fields_on_court_id  (court_id)
#
class Court
  class Field < ApplicationRecord
    belongs_to :court

    enum :surface, { grass: 0, hard: 1 }
  end
end
