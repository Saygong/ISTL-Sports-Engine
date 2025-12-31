# frozen_string_literal: true

# == Schema Information
#
# Table name: sports
#
#  id           :integer          not null, primary key
#  created_at   :datetime         not null
#  description  :string
#  updated_at   :datetime         not null
#  variant_kind :integer          default(0), not null
#
class Sport < ApplicationRecord
  enum :variant_kind, { tennis: 0, ping_pong: 1 }
end
