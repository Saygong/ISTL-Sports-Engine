class OrganizersController < ApplicationController
  include Authentications::Organizer

  before_action :authenticate_user!
  require_organizer!

  # Controller action to display the dashboard page for the connected organizer.
  def show
    # noinspection RailsParamDefResolve
    @tournaments = current_user
                   .tournaments
                   .includes(:sport, :court, matches: [:referee, { teams: :players }, :match_result])
                   .order(start_date: :asc)

    matches = @tournaments.flat_map(&:matches)

    # Hash: match_id => Match::Result
    @results_by_match_id = Match::Result
                           .includes(teams_match_results: { team: :players })
                           .where(match_id: matches.map(&:id))
                           .index_by(&:match_id)
    # Precompute labels
    @participants_by_match_id = build_participants_by_match_id(matches)
    @winner_by_match_id = build_winner_by_match_id(@results_by_match_id)
  end

  def profile
    redirect_to profile_user_path
  end

  private

  def build_participants_by_match_id matches
    matches.index_with do |m|
      # two “sides” from the teams; format as initials + last name
      teams = m.teams.to_a

      left_players  = teams[0]&.players.to_a
      right_players = teams[1]&.players.to_a

      {
        left:  left_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" },
        right: right_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }
      }
    end
  end

  def build_winner_by_match_id results_by_match_id
    results_by_match_id.transform_values do |result|
      winner_team = result.teams_match_results.find { |r| r.team_status == 'winner' }&.team
      players = winner_team&.players.to_a

      # Return a nice label the view can print directly
      if players.any?
        players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }.join(' / ')
      else
        'Recorded'
      end
    end
  end
end
