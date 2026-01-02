class RefereesController < ApplicationController
  include Authentications::Referee

  before_action :authenticate_user!
  before_action :require_referee!
  before_action :set_match_for_result, only: [:new_match_result, :create_match_result]

=begin
  before_action only: [:show] do
    unless current_user.is_a?(User::Referee)
      redirect_to root_path, alert: I18n.t('errors.controllers.referees.unauthorized')
    end
  end
=end

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
    @round_by_match_id        = matches.index_with { |m| m.round.present? ? "Round #{m.round}" : "—" }

    # Optional: show a short “winner label” in completed table
    @winner_by_match_id = build_winner_by_match_id(@results_by_match_id)
  end

  # GET /referee/matches/:match_id/result/new
  def new_match_result
    @participants = participants_for_match(@match)

    # In data model, the winner is a TEAM (teams_match_results), not a single player
    @winner_team_options = @match.teams.map { |t| [team_label(t), t.id] }
  end

  # POST /referee/matches/:match_id/result
  def create_match_result
    # Prevent duplicates
    if Match::Result.exists?(match_id: @match.id)
      redirect_to referee_path, alert: "A result already exists for this match."
      return
    end

    winner_team_id = params[:winner_team_id].presence
    if winner_team_id.blank?
      flash.now[:alert] = "Please select a winner."
      @participants = participants_for_match(@match)
      @winner_team_options = @match.teams.map { |t| [team_label(t), t.id] }
      render :new_match_result, status: :unprocessable_entity
      return
    end

    winner_team = @match.teams.find(winner_team_id)

    Match::Result.transaction do
      result = Match::Result.create!(
        match: @match,
        description: match_result_params[:description]
      )

      @match.teams.each do |team|
        result.teams_match_results.create!(
          team: team,
          team_status: (team.id == winner_team.id ? "winner" : "loser")
        )
      end
    end

    redirect_to referee_path, notice: "Result saved."
  rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotFound => e
    redirect_to referee_path, alert: e.message
  end


  def profile
    redirect_to profile_user_path
  end

  private

  def set_match_for_result
    @match =
      Match
        .includes(tournament: [:sport, :court], teams: :players)
        .find(params[:match_id])

    # Security: referee can only insert results for their own matches
    unless @match.referee_id == current_user.id
      redirect_to referee_path, alert: "You are not assigned to this match."
    end
  end

  def match_result_params
    params.require(:match_result).permit(:description)
  end

  def build_participants_by_match_id(matches)
    matches.index_with { |m| participants_for_match(m) }
  end

  def participants_for_match(match)
    teams = match.teams.to_a
    left_players  = teams[0]&.players.to_a
    right_players = teams[1]&.players.to_a

    {
      left:  left_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" },
      right: right_players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }
    }
  end

  def team_label(team)
    players = team.players.to_a
    return "Team ##{team.id}" if players.empty?

    players.map { |p| "#{p.first_name.to_s.first}. #{p.last_name}" }.join(" / ")
  end

  def build_winner_by_match_id(results_by_match_id)
    results_by_match_id.transform_values do |result|
      winner_team = result.teams_match_results.find { |r| r.team_status == "winner" }&.team
      winner_team ? team_label(winner_team) : "Recorded"
    end
  end
end