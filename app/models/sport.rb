# frozen_string_literal: true

# == Schema Information
#
# Table name: sports
#
#  id           :integer          not null, primary key
#  description  :string
#  variant_kind :integer          default(0), not null
#  format_kind  :integer          default(0), not null
#  gender       :integer          default(0), not null
#  min_age      :datetime
#  max_age      :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Sport < ApplicationRecord
  include WithGender

  enum :variant_kind, { tennis: 0, ping_pong: 1 }
  enum :format_kind, { single: 0, double: 1 }
end
