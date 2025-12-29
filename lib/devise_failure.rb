# frozen_string_literal: true

class DeviseFailure < Devise::FailureApp
  def redirect_url
    # Hash Deconstruction
    warden_options => { scope:, message:, action: }

    if scope == :user && message == :unconfirmed && action == 'unauthenticated'
      # Implicitly returns the path to the "unconfirmed" custom page
      # noinspection RubyResolve
      unconfirmed_new_resources_user_path
    else
      # Devise/Warden's default behavior
      super
    end
  end
end
