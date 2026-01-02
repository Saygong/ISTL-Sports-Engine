# frozen_string_literal: true

module Players
  class MatchesController < ApplicationController
    include Authentications::Player

    before_action :authenticate_user!
    before_action :require_player!
    before_action :set_match, only: [:book, :unbook]

    # GET /player/matches
    def index
      @matches = current_user.viewed_matches
                             .includes(:tournament, :referee, teams: :players)
                             .order(date: :asc)
      @participants_by_match_id = build_participants_by_match_id(@matches)
    end

    # POST /player/matches/:match_id/book
    def book
      ViewersMatch.find_or_create_by!(match_id: @match.id, viewer_id: current_user.id)
      redirect_back fallback_location: player_tournament_path(@match.tournament), notice: 'Match booked successfully.'
    end

    # POST /player/matches/:match_id/unbook
    def unbook
      vm = ViewersMatch.find_by(match_id: @match.id, viewer_id: current_user.id)
      vm&.destroy
      redirect_back fallback_location: player_matches_path, notice: 'Booking removed.'
    end

    private

    def set_match
      @match = Match.find(params[:match_id])
    end

    def build_participants_by_match_id matches
      matches.index_with do |m|
        teams = m.teams.to_a
        left_players  = teams[0]&.players.to_a
        right_players = teams[1]&.players.to_a

        {
          left:  left_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" },
          right: right_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }
        }
      end
    end
  end
end
