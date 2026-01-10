class ApplicationController < ActionController::Base
  # Controller Integration for DeviseTokenAuth
  # [https://devise-token-auth.gitbook.io/devise-token-auth/usage/controller_methods]
  # include DeviseTokenAuth::Concerns::SetUserByToken

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  # Simple error handling by redirecting to predefined error pages
  rescue_from StandardError do |exception|
    case exception
    in ActiveRecord::RecordNotFound
      redirect_to '/404'
    in ActiveRecord::RecordInvalid
      redirect_to '/422'
    else
      redirect_to '/500'
    end
  end
end
