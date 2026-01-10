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

      @participants_by_match_id = build_participants_by_match_id(@matches)
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

      @participants_by_match_id = build_participants_by_match_id(@matches)
    end

    private

    def build_participants_by_match_id matches
      matches.map do |m|
        # two “sides” from the teams; format as initials + last name
        teams = m.teams.to_a

        left_players  = teams[0]&.players.to_a
        right_players = teams[1]&.players.to_a

        {
          m.id => {
            left:  left_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" },
            right: right_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }
          }
        }
      end.reduce({}, :merge)
    end
  end
end
