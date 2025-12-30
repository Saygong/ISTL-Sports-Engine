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

  # TODO: add owner field, every field (better if is called court) must have an owner
  # TODO: add a method "owned_fields" that given a user (that must be organizer) returns all his fields

end
