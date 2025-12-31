ActiveAdmin.register Court do
  extend Admin::ModelAttributes

  permit_params(*all_attributes)

  filter :name
  filter :description

  index do
    selectable_column
    id_column
    column :name
    column :description
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
            f.input attr
          end
        end

        f.actions
      end
    end
end
