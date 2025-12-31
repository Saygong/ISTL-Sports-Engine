# frozen_string_literal: true

ActiveAdmin.register Field do
  extend Admin::ModelAttributes

  permit_params(*all_attributes)

  [:name, :surface, :max_seats]
    .each { filter it }

  index do
    selectable_column
    column :name
    column :surface
    column :max_seats
    actions
  end

  all_attributes(except: [])
    .then do |attrs|
      show do
        attributes_table(*attrs) {}
      end
    end

  all_attributes
    .then do |attrs|
      form do |f|
        f.inputs do
          attrs.each do |attr|
            case attr
            when :surface
              f.input attr, include_blank: false
            else
              f.input attr
            end
          end
        end

        f.actions
      end
    end
end
