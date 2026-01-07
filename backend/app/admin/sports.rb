ActiveAdmin.register Sport do
  extend Admin::ModelAttributes

  permit_params(*all_attributes)

  filter :variant_kind

  index do
    selectable_column
    id_column
    column :description
    column :variant_kind
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
            when :variant_kind
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
