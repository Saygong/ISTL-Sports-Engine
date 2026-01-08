# frozen_string_literal: true

class RefereesController < ApplicationController
  include Authentications::Referee

  before_action :authenticate_user!
  require_referee!

  # ...
  def show
    # Tournaments where this referee has at least one match
    @tournaments =
      Tournament
        .joins(:matches)
        .where(matches: { referee_id: current_user.id })
        .distinct
        .includes(:sport, :court, matches: [:referee, { teams: :players }, :match_result])
        .order(start_date: :asc)

    matches = @tournaments.flat_map(&:matches).select { |m| m.referee_id == current_user.id }

    @results_by_match_id =
      Match::Result
        .includes(teams_match_results: { team: :players })
        .where(match_id: matches.map(&:id))
        .index_by(&:match_id)

    @participants_by_match_id = build_participants_by_match_id(matches)
    @round_by_match_id        = matches.index_with { |m| m.round.present? ? "Round #{m.round}" : '—' }

    # Optional: show a short “winner label” in completed table
    @winner_by_match_id = build_winner_by_match_id(@results_by_match_id)
  end

  def profile
    redirect_to profile_user_path
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

  def team_label team
    return "Team ##{team.id}" if team.players.empty?

    team.players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }.join(' / ')
  end

  def build_winner_by_match_id results_by_match_id
    results_by_match_id.transform_values do |result|
      winner_team = result.teams_match_results.find { |r| r.team_status == 'winner' }&.team
      winner_team ? team_label(winner_team) : 'Recorded'
    end
  end
end