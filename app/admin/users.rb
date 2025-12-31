# frozen_string_literal: true

# noinspection RubyResolve
ActiveAdmin.register User do
  extend Admin::User::ResourceDSL

  # Restrict the actions allowed by the admin for the user page.
  # Since users are always created with a specific type, only readable actions are allowed on the generic page.
  actions :all, except: [:new, :edit, :destroy]

  # These are methods defined in the Admin::User::ResourceDSL module.
  # They contain pre-packaged configurations.
  user_filter
  user_show

  index do
    id_column
    column :email
    column :created_at
    actions
  end
end
