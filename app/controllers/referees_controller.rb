# frozen_string_literal: true

class RefereesController < ApplicationController
  include Authentications::Referee

  before_action :authenticate_user!

  require_referee!

  # GET /referee
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

  # ...
  def new_match_result
    @match = current_user
             .refereed_matches
             .find(params[:match_id])

    @participants = participants_for_match(@match)

    # In data model, the winner is a TEAM (teams_match_results), not a single player
    @winner_team_options = @match.teams.map { |t| [team_label(t), t.id] }
  end

  # ...
  def create_match_result
    @match = current_user
             .refereed_matches
             .find(params[:match_id])

    # Prevent duplicates
    if Match::Result.exists?(match_id: @match.id)
      redirect_to referee_path, alert: 'A result already exists for this match.'
      return
    end

    winner_team_id = params[:winner_team_id].presence

    if winner_team_id.blank?
      flash.now[:alert] = 'Please select a winner.'
      @participants = participants_for_match(@match)
      @winner_team_options = @match.teams.map { |t| [team_label(t), t.id] }
      render :new_match_result, status: :unprocessable_entity
      return
    end

    winner_team = @match.teams.find(winner_team_id)

    Match::Result.transaction do
      result = Match::Result.create!(
        match:       @match,
        description: params[:description]
      )

      @match.teams.each do |team|
        result.teams_match_results.create!(
          team:        team,
          team_status: (team.id == winner_team.id ? 'winner' : 'loser')
        )
      end
    end

    redirect_to referee_path, notice: 'Result saved.'
  rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotFound => e
    redirect_to referee_path, alert: e.message
  end

  def profile
    redirect_to profile_user_path
  end

  private

  def build_participants_by_match_id matches
    matches.index_with { |m| participants_for_match(m) }
  end

  def participants_for_match match
    teams = match.teams.to_a
    left_players  = teams[0]&.players.to_a
    right_players = teams[1]&.players.to_a

    {
      left:  left_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" },
      right: right_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }
    }
  end

  def team_label team
    players = team.players.to_a
    return "Team ##{team.id}" if players.empty?

    players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }.join(' / ')
  end

  def build_winner_by_match_id results_by_match_id
    results_by_match_id.transform_values do |result|
      winner_team = result.teams_match_results.find { |r| r.team_status == 'winner' }&.team
      winner_team ? team_label(winner_team) : 'Recorded'
    end
  end
end
