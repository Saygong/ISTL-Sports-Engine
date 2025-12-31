# frozen_string_literal: true

module Admin
  module User
    module ResourceDSL
      def self.extended base
        base.instance_exec do
          define_singleton_method :user_permit_params do
            permit_params :email, :password, :password_confirmation
          end

          define_singleton_method :user_filter do
            [:email, :first_name, :last_name]
              .each { |attribute| filter attribute }
          end

          define_singleton_method :user_index do
            index do
              selectable_column
              id_column
              column :email
              column :created_at
              actions
            end
          end

          define_singleton_method :user_show do
            show do
              attributes_table :id,
                               :email,
                               :first_name,
                               :last_name,
                               :gender,
                               :birthdate,
                               :created_at,
                               :updated_at do
                               end
            end
          end

          define_singleton_method :user_form do
            form do |f|
              f.inputs do
                if f.object.new_record?
                  f.input :email
                else
                  f.input :email, input_html: { readonly: true, disabled: true }, as: :string
                end

                f.input :password
                f.input :password_confirmation
              end

              f.actions
            end
          end
        end
      end
    end
  end
end
