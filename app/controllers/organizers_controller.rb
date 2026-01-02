class OrganizersController < ApplicationController
  include Authentications::Organizer

  before_action :authenticate_user!
  require_organizer! # only: [:show]

  # Controller action to display the dashboard page for the connected organizer.
  # GET /organizer
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
    @winner_by_match_id       = build_winner_by_match_id(@results_by_match_id)

    # Extract all matches from the tournament list and retrieve the corresponding results
    #     @tournaments
    #       .map(&:matches)
    #       .flatten
    #       .then { |matches| @results_by_match_id = Match::Result.where(match: matches) }
  end

  # GET /organizer/tournaments/new
  def new
    load_tournament_form_data
    @tournament = current_user.tournaments.build
  end

  # POST /organizer/tournaments
  def create
    load_tournament_form_data
    @tournament = current_user.tournaments.build(tournament_params)

    referee_ids = normalize_referee_ids(params[:referee_ids])

    # TODO: generazione match fino alla finale con 1 per partita con referee nei vari court fields e generazione dei team

    # Backend validation for referees
    if referee_ids.empty?
      @tournament.errors.add(:base, 'Please select at least 1 referee.')
      return render :new, status: :unprocessable_entity
    end

    if referee_ids.length > 3
      @tournament.errors.add(:base, 'You can select up to 3 referees.')
      return render :new, status: :unprocessable_entity
    end

    ActiveRecord::Base.transaction do
      @tournament.save!

      # Create join rows for referees
      referee_ids.each do |rid|
        RefereesTournament.create!(tournament: @tournament, referee_id: rid)
      end

      # Generate the bracket matches (rounds + dates + referee assignment)
      @tournament.generate_bracket_matches!(referee_ids: referee_ids)
    end

    redirect_to organizer_path, notice: 'Tournament created successfully.'
  rescue ActiveRecord::RecordInvalid
    render :new, status: :unprocessable_entity
  end

  def profile
    redirect_to profile_user_path
  end

  private

  def load_tournament_form_data
    @sports = Sport.all.order(:description)
    @courts = Court.all.order(:name)
    @referees = User::Referee.all.order(:last_name, :first_name)

    # For enums in Tournament (WithGender / WithComposition)
    @gender_options = Tournament.genders.keys.map { |k| [k.humanize, k] }
    @composition_options = Tournament.compositions.keys.map { |k| [k.humanize, k] }
  end

  def tournament_params
    params.require(:tournament).permit(
      :name,
      :start_date,
      :sport_id,
      :court_id,
      :min_age,
      :max_age,
      :gender,
      :composition,
      :number_of_matches
    )
  end

  def normalize_referee_ids raw
    Array(raw)
      .map(&:to_s)
      .map(&:strip)
      .reject(&:blank?)
      .uniq
  end

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
