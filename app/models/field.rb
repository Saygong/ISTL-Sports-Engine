# frozen_string_literal: true

# == Schema Information
#
# Table name: fields
#
#  id          :integer          not null, primary key
#  name        :string
#  description :string
#  surface     :integer          default(0), not null
#  max_seats   :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Field < ApplicationRecord
  enum :surface, { grass: 0, hard: 1 }
end
