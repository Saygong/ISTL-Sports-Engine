ActiveAdmin.register Court::Field do
  extend Admin::ModelAttributes

  menu parent: 'Courts'

  permit_params(*all_attributes)

  [:name, :description, :surface, :max_seats]
    .each { |attr| filter attr }

  index do
    selectable_column
    id_column

    [:name, :description, :surface, :max_seats]
      .each { column it }

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
