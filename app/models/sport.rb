# frozen_string_literal: true

# == Schema Information
#
# Table name: sports
#
#  id           :integer          not null, primary key
#  created_at   :datetime         not null
#  description  :string
#  format_kind  :integer          default(0), not null
#  gender       :integer          default(0), not null
#  updated_at   :datetime         not null
#  variant_kind :integer          default(0), not null
#  min_age      :integer
#  max_age      :integer
#
class Sport < ApplicationRecord
  include WithGender

  enum :variant_kind, { tennis: 0, ping_pong: 1 }
  enum :format_kind, { single: 0, double: 1 }
end
