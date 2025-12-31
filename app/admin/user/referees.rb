# frozen_string_literal: true

# noinspection RubyResolve
ActiveAdmin.register User::Referee do
  extend Admin::User::ResourceDSL

  menu parent: 'User'

  user_permit_params
  user_filter
  user_index
  user_show
  user_form
end
