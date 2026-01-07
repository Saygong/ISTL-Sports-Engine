# frozen_string_literal: true

module Players
  class MatchesController < ApplicationController
    include Authentications::Player

    before_action :authenticate_user!
    require_player!

    def index
      @matches = current_user
                 .viewed_matches
                 .includes(teams: :players)
                 .order(date: :asc)

      @participants_by_match_id = @matches
                                  .map(&:participants_by_match_id)
                                  .reduce(:merge)
    end

    # ...
    def book
      Match
        .find(params[:match_id])
        .tap { ViewersMatch.find_or_create_by!(match_id: it.id, viewer_id: current_user.id) }
        .then do
          redirect_back fallback_location: player_matches_path,
                        notice:            I18n.t('notices.controllers.players.matches.book')
        end
    end

    # ...
    def unbook
      Match
        .find(params[:match_id])
        .then do |match|
          ViewersMatch
            .find_by(match_id: match.id, viewer_id: current_user.id)
            &.then(&:destroy!)
        end

      redirect_back fallback_location: player_matches_path,
                    notice:            I18n.t('notices.controllers.players.matches.unbook')
    end

    def joined
      @matches = Match
                 .includes(teams: :players)
                 .where(players: { id: current_user.id })

      @participants_by_match_id = @matches
                                  .map(&:participants_by_match_id)
                                  .reduce(:merge)
    end
  end
end
