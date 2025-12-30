# frozen_string_literal: true

# noinspection RubyResolve
ActiveAdmin.register User do
  extend Admin::User::ResourceDSL

  menu parent: 'User',
       label: I18n.t('active_admin.menu.users.all'),
       priority: 1 # So it's the first menu item visible

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
