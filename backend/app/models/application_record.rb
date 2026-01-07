class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  class << self
    # Bare list of all potentially searchable attributes
    # [https://rubydoc.info/gems/ransack/4.4.1/Ransack/Adapters/ActiveRecord/Base]
    def ransackable_attributes _auth_object=nil
      authorizable_ransackable_attributes
    end

    # Bare list of all potentially searchable associations
    # [https://rubydoc.info/gems/ransack/4.4.1/Ransack/Adapters/ActiveRecord/Base]
    def ransackable_associations _auth_object=nil
      authorizable_ransackable_associations
    end
  end
end
