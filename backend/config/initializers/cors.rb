# frozen_string_literal: true

Rails.application.config.middleware.insert_before Warden::Manager, Rack::Cors do
  allow do
    origins %r{http://localhost(:\d+)?},
            %r{http://127\.0\.0\.1(:\d+)?}

    # noinspection RailsParamDefResolve
    resource '*',
             headers: :any,
             methods: [:get, :post, :patch, :put]
  end
end

