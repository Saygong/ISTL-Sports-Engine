class ApplicationController < ActionController::Base
  # Controller Integration for DeviseTokenAuth
  # [https://devise-token-auth.gitbook.io/devise-token-auth/usage/controller_methods]
  # include DeviseTokenAuth::Concerns::SetUserByToken

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  # ...
  rescue_from ActiveRecord::RecordInvalid do |exception|
    redirect_back fallback_location: root_path,
                  alert:             exception.record.errors.full_messages.to_sentence
  end
end
