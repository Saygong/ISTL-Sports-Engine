Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"

  # Index route -> routing to index controller
  resource :index
  resolve("index") { [:index] }

  # Creating all seven (index, new, create, show, edit, update - full, update - partial and destroy) routes
  resources :tournaments
  resources :matches

  # No need for us to create a match_player or match_viewer object. This will be managed with tournament creation
  resources :match_player, except: [:create, :new, :update]
  resources :match_viewer, except: [:create, :new, :update]

  resources :users
  resources :referees
  resources :organizers

  resources :match_results, except: [:create, :new, :update]
  resources :match_result_winners, except: [:create, :new, :update]

end
