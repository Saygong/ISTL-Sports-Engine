# frozen_string_literal: true

# == Schema Information
#
# Table name: courts
#
#  id          :integer          not null, primary key
#  name        :string
#  description :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class Court < ApplicationRecord
  has_many :tournaments
  has_many :fields, class_name: 'Court::Field', dependent: :destroy


  # TODO: add owner field, every field (better if is called court) must have an owner
  # TODO: add a method "owned_fields" that given a user (that must be organizer) returns all his fields
end
