# frozen_string_literal: true

module Mutations
  module Users
    class SignOut < BaseMutation
      type Types::Common::ActionResult

      def resolve
        context[:current_user]
          .then do |user|
            user.tokens = nil
            user.save ? :ok : :ko
          end
      end
    end
  end
end
