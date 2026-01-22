import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { RoutesEnum } from "../../AppRoutes";
import {
  MatchFragment,
  Player,
  useCreateMatchResultMutation,
  useMatchQuery,
} from "../../generated/graphql";
import { playerShort } from "../player/TournamentDetail";

type Props = {
  // Optional defaults (e.g. in edit mode)
  initialDescription?: string;
  initialWinnerTeamId?: string;

  onSaved?: () => void; // optional callback on success
};

function humanize(s?: string | null): string {
  if (!s) return "—";
  const spaced = s.replace(/_/g, " ").trim();
  return spaced ? spaced[0].toUpperCase() + spaced.slice(1) : "—";
}

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateDMY(value?: string | Date | null): string {
  const d = toDate(value);
  if (!d) return "—";
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

function formatTimeHM(value?: string | Date | null): string {
  const d = toDate(value);
  if (!d) return "—";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

const mockData: Props = {
  initialDescription: "",
  initialWinnerTeamId: "",
};

export default function RefereeMatchResult() {
  const { initialDescription = "", initialWinnerTeamId = "" } = mockData;

  const [description, setDescription] = useState<string>(initialDescription);
  const [winnerTeamId, setWinnerTeamId] = useState<string>(initialWinnerTeamId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [{ data: matchData }] = useMatchQuery({
    variables: {
      id: id || "",
    },
    pause: !id,
  });
  const match: MatchFragment | undefined = matchData?.match;

  const [, createMatchResultMutation] = useCreateMatchResultMutation();

  const sportLabel = useMemo(() => {
    if (!match) return "";
    const desc = match.tournament.sport.description?.trim();
    return desc && desc.length > 0
        ? desc
        : humanize(match.tournament.sport.variantKind);
  }, [match]);

  if (!match) return null;

  const tournamentName = match.tournament.name;
  const matchDate = formatDateDMY(match.date);
  const matchTime = formatTimeHM(match.date);
  const stadiumName = match.tournament.court?.name || "—";
  const participants: { left: Player[]; right: Player[] } = {
    // @ts-expect-error player type mismatch
    left: match.teams?.length ? match.teams[0].players : [],
    // @ts-expect-error player type mismatch
    right: match.teams?.length > 1 ? match.teams[1].players : [],
  };

  const handleSubmit = async () => {
    if (!winnerTeamId) {
      alert("Please select the winner.");
      return;
    }
    setIsSubmitting(true);

    const res = await createMatchResultMutation({
      args: {
        description,
        teamId: winnerTeamId,
        matchId: match.id,
      },
    });

    if (res.data?.createMatchResult) {
      navigate(RoutesEnum.RefereeHomePage);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="referee-result-page">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link className="navbar-brand" to={RoutesEnum.RefereeHomePage}>
              ISTL Sports
            </Link>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <Link className="nav-link" to={RoutesEnum.RefereeHomePage}>
                  Homepage
                </Link>
                <Link className="nav-link" to={RoutesEnum.Profile}>
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container py-4">
          <div className="page-narrow">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
              <div className="min-w-0">
                <h2 className="mb-1">Insert match result</h2>
                <div className="page-subtitle">
                  Confirm the final score and assign the winner
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <span className="meta-chip">Tournament: {tournamentName}</span>
                <span className="sport-chip">{sportLabel}</span>
                <span className="meta-chip">{matchDate}</span>
              </div>
            </div>

            <section className="card shadow-sm">
              <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <strong className="fs-5">Match details</strong>
              </div>

              <div className="card-body">
                <div>
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-8">
                      <div className="detail-item">
                        <div className="detail-label">
                          <strong>Participants</strong>
                        </div>
                        <div className="detail-value">
                          <div className="participants mt-1">
                            <div className="team">
                              {participants.left.map((player, i) => (
                                  <span className="player" key={`l-${i}`}>
                                {playerShort(player)}
                              </span>
                              ))}
                            </div>
                            <div className="vs">vs</div>
                            <div className="team">
                              {participants.right.map((player, i) => (
                                  <span className="player" key={`r-${i}`}>
                                {playerShort(player)}
                              </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-2">
                      <div className="detail-item">
                        <div className="detail-label">
                          <strong>Round</strong>
                        </div>
                        <div className="detail-value">{match.round ?? "—"}</div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4">
                      <div className="detail-item">
                        <div className="detail-label">
                          <strong>Start date</strong>
                        </div>
                        <div className="detail-value">{matchDate}</div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4">
                      <div className="detail-item">
                        <div className="detail-label">
                          <strong>Start time</strong>
                        </div>
                        <div className="detail-value">{matchTime}</div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4">
                      <div className="detail-item">
                        <div className="detail-label">
                          <strong>Stadium</strong>
                        </div>
                        <div className="detail-value">{stadiumName}</div>
                      </div>
                    </div>
                  </div>

                  <div className="section-block">
                    <div className="section-header">
                      <h3 className="section-title fs-6">Results</h3>
                    </div>

                    <div className="p-3 p-md-4">
                      <div className="row g-3 mb-3">
                        <div className="col-12">
                          <label
                              className="form-label fw-semibold"
                              htmlFor="desc"
                          >
                            Description / score
                          </label>
                          <textarea
                              id="desc"
                              className="form-control"
                              rows={3}
                              placeholder="Example: 6-4, 6-7, 7-5..."
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>

                        <div className="col-12 col-md-8">
                          <label
                              htmlFor="winner_team_id"
                              className="form-label fw-semibold"
                          >
                            Winner
                          </label>
                          <select
                              id="winner_team_id"
                              className="form-select"
                              required
                              value={winnerTeamId}
                              onChange={(e) => setWinnerTeamId(e.target.value)}
                          >
                            <option value="" disabled>
                              Select the winner
                            </option>
                            {match.teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                  {team.name}
                                </option>
                            ))}
                          </select>

                          <div className="form-text">
                            Only participants can be selected.
                          </div>
                        </div>
                      </div>

                      <div className="actions-bar">
                        <Link
                            className="btn btn-outline-secondary"
                            to={RoutesEnum.RefereeHomePage}
                        >
                          Cancel
                        </Link>
                        <button
                            onClick={handleSubmit}
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
  );
}
