import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { RoutesEnum } from "../../AppRoutes";
import { useAuth } from "../../contexts/AuthContext";
import {
  Player,
  Tournament,
  useBookMatchMutation,
  useJoinableTeamsQuery,
  useJoinTournamentMutation,
  useTournamentQuery,
} from "../../generated/graphql";
import { isEligible } from "./HomePage";

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

export function playerShort(p?: Player | null): string {
  if (!p) return "—";
  const fi = (p.firstName ?? "").trim().slice(0, 1);
  const ln = (p.lastName ?? "").trim();
  const label = `${fi ? `${fi}.` : ""}${fi && ln ? " " : ""}${ln}`.trim();
  return label || "—";
}

function slotDotClass(filled: number) {
  // ERB: filled.zero? ? "slot-dot--empty" : "slot-dot--half"
  if (filled <= 0) return "slot-dot--empty";
  if (filled === 1) return "slot-dot--half";
  return "slot-dot--full"; // optional if you have CSS
}

export default function PlayerTournamentDetail() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [bookingMatchId, setBookingMatchId] = useState<string | null>(null);
  const [, joinTournamentMutation] = useJoinTournamentMutation();
  const [, bookMatchMutation] = useBookMatchMutation();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookedMatchIds, setBookedMatchIds] = useState(() =>
      (user as Player).bookedMatches?.map((m) => m.id),
  );

  const { id } = useParams();
  const [{ data: tournamentData }] = useTournamentQuery({
    variables: {
      id: id || "",
    },
  });
  // @ts-expect-error type Organizer is wonky
  const tournament: Tournament | undefined | null = tournamentData?.tournament;
  const eligible = isEligible(user, tournament);
  const isRegistered = (user as Player).joinedTournaments?.some(
      (t) => t.id === tournament?.id,
  );

  const [{ data: joinableTeamsData }] = useJoinableTeamsQuery({
    variables: {
      tournamentId: tournament ? tournament.id : "",
    },
    pause: !tournament,
  });
  const joinableTeams = joinableTeamsData
      ? (joinableTeamsData.me as Player).joinableTeams
      : [];

  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null);

  const bookedSet = useMemo(() => new Set(bookedMatchIds), [bookedMatchIds]);

  const sportLabel = useMemo(() => {
    const desc = tournament?.sport.description?.trim();
    return desc && desc.length > 0
        ? desc
        : humanize(tournament?.sport.variantKind);
  }, [tournament]);

  if (!tournament) return null;

  const handleRegister = async () => {
    if (!eligible) return;

    setIsRegistering(true);

    const res = await joinTournamentMutation({
      args: {
        tournamentId: tournament.id,
      },
    });

    if (res.data?.joinTournament) {
      setIsRegistering(false);
      navigate(RoutesEnum.PlayerTournamentDetail.replace(":id", tournament.id.toString()))
    }
  };

  const handleBook = async (matchId: string) => {
    setBookingMatchId(matchId);
    const res = await bookMatchMutation({ args: { matchId } });

    if (res.data?.bookMatch) {
      setBookedMatchIds((ids) => [...ids, matchId]);
      setBookingMatchId(null);
    }
  };

  const handleJoinTeam = async (teamId: string, teamName?: string) => {
    // const ok = window.confirm(`Join ${teamName}?`);
    // if (!ok) return;

    const key = String(teamId);
    setJoiningTeamId(key);

    await joinTournamentMutation({
      args: {
        teamId,
        tournamentId: tournament.id,
      },
    });

    setJoiningTeamId(null);
  };

  return (
      <div className="player-tournament-detail">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link className="navbar-brand" to={RoutesEnum.PlayerHomePage}>
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
                <Link className="nav-link" to={RoutesEnum.PlayerHomePage}>
                  Homepage
                </Link>
                <Link
                    className="nav-link"
                    to={RoutesEnum.PlayerTournamentRegistrations}
                >
                  Tournament Registrations
                </Link>
                <Link className="nav-link" to={RoutesEnum.PlayerBookedMatches}>
                  Booked Matches
                </Link>
                <Link className="nav-link" to={RoutesEnum.Profile}>
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container py-4">
          <div className="page-narrow mx-auto">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
              <div className="min-w-0">
                <h2 className="mb-1">Tournament details</h2>
                <div className="text-body-secondary">
                  View informations for a specific tournament
                </div>
              </div>

              <div className="header-actions">
              <span className="elig-chip" title="Eligibility status">
                <span
                    className={`elig-dot ${
                        eligible ? "elig-dot--ok" : "elig-dot--no"
                    }`}
                    aria-hidden="true"
                />
                {eligible ? "Eligible" : "Not eligible"}
              </span>

                {tournament.composition === "single" && (
                    <>
                      {isRegistered ? (
                          <span
                              className="btn btn-outline-secondary disabled"
                              aria-disabled="true"
                          >
                      Already registered
                    </span>
                      ) : tournament?.matches?.length ? (
                          <span
                              className="btn btn-outline-secondary disabled"
                              aria-disabled="true"
                          >
                      Tournament started
                    </span>
                      ) : (
                          <button
                              type="button"
                              className="btn btn-primary"
                              disabled={!eligible || isRegistering}
                              onClick={handleRegister}
                          >
                      <span className="me-1" aria-hidden="true">
                        ✍️
                      </span>
                            {isRegistering ? "Registering..." : "Register"}
                          </button>
                      )}
                    </>
                )}
              </div>
            </div>

            {/* Tournament info card */}
            <section className="card shadow-sm mb-4">
              <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <strong className="fs-5">{tournament.name}</strong>
                  <span className="sport-chip">{sportLabel}</span>
                </div>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="detail-item">
                      <div className="detail-label">Name</div>
                      <div className="detail-value">{tournament.name}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="detail-item">
                      <div className="detail-label">Sport</div>
                      <div className="detail-value">
                        {humanize(tournament.sport.variantKind)}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="detail-item">
                      <div className="detail-label">Start date</div>
                      <div className="detail-value">
                        {formatDateDMY(tournament.startDate)}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="detail-item">
                      <div className="detail-label">Stadium</div>
                      <div className="detail-value">
                        {tournament.court?.name || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="detail-item">
                      <div className="detail-label">Organizer</div>
                      <div className="detail-value">
                        {tournament.organizer?.firstName?.trim() || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="detail-item">
                      <div className="detail-label">Gender of players</div>
                      <div className="detail-value">
                        {humanize(tournament.gender)}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="detail-item">
                      <div className="detail-label">Match type</div>
                      <div className="detail-value">
                        {tournament.composition === "single"
                            ? "Individual"
                            : "Team (double)"}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="detail-item">
                      <div className="detail-label">Min age</div>
                      <div className="detail-value">{tournament.minAge}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="detail-item">
                      <div className="detail-label">Max age</div>
                      <div className="detail-value">{tournament.maxAge}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Matches card */}
            <section className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong className="fs-5">Matches</strong>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                  <tr>
                    <th scope="col">Participants</th>
                    <th scope="col">Round</th>
                    <th scope="col">Start date</th>
                    <th scope="col">Start time</th>
                    <th scope="col">Stadium</th>
                    <th scope="col">Seats</th>
                    <th scope="col" className="text-end">
                      Action
                    </th>
                  </tr>
                  </thead>

                  <tbody>
                  {tournament?.matches.length === 0 ? (
                      <tr>
                        <td
                            colSpan={7}
                            className="text-center py-5 text-body-secondary"
                        >
                          No matches yet.
                        </td>
                      </tr>
                  ) : (
                      tournament?.matches.map((m) => {
                        const mId = String(m.id);

                        const participants: { left: Player[]; right: Player[] } =
                            {
                              left: m.teams?.length ? m.teams[0].players : [],
                              right: m.teams?.length > 1 ? m.teams[1].players : [],
                            };
                        const maxSeats = Number(m.field?.maxSeats ?? 0) || 0;
                        const roundLabel =
                            m.round != null ? `Round ${m.round}` : "—";
                        const used = m.viewers?.length || 0;
                        const available = Math.max(maxSeats - used, 0);
                        const reserved = bookedSet.has(mId);
                        const lowSeats = available <= 20;

                        return (
                            <tr key={mId}>
                              <td>
                                <div className="participants">
                                  {participants ? (
                                      <>
                                        <div className="team">
                                          {participants.left.map((player, i) => (
                                              <span
                                                  className="player"
                                                  key={`${mId}-l-${i}`}
                                              >
                                        {playerShort(player)}
                                      </span>
                                          ))}
                                        </div>
                                        <div className="vs">vs</div>
                                        <div className="team">
                                          {participants.right.map((player, i) => (
                                              <span
                                                  className="player"
                                                  key={`${mId}-r-${i}`}
                                              >
                                        {playerShort(player)}
                                      </span>
                                          ))}
                                        </div>
                                      </>
                                  ) : null}
                                </div>
                              </td>

                              <td>
                            <span className="badge text-bg-secondary">
                              {roundLabel}
                            </span>
                              </td>

                              <td>{formatDateDMY(m.date)}</td>
                              <td>{formatTimeHM(m.date)}</td>
                              <td>{tournament.court?.name || "—"}</td>

                              <td>
                            <span
                                className={`seat-pill ${
                                    lowSeats ? "seat-pill--low" : ""
                                }`}
                            >
                              <span className="seat-dot" aria-hidden="true" />
                              {available} available
                            </span>
                              </td>

                              <td className="text-end">
                                {reserved ? (
                                    <span className="badge text-bg-success me-2">
                                Reserved
                              </span>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleBook(m.id)}
                                        disabled={bookingMatchId === mId}
                                    >
                                <span className="me-1" aria-hidden="true">
                                  🎟️
                                </span>
                                      {bookingMatchId === mId ? "Booking..." : "Book"}
                                    </button>
                                )}
                              </td>
                            </tr>
                        );
                      })
                  )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* === TEAMS (translated from ERB) === */}
            {tournament.composition === "double" && (
                <>
                  {/* Available teams (joinable) */}
                  <section className="card shadow-sm mt-4">
                    <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                      <div className="min-w-0">
                        <strong className="fs-5">Available teams</strong>
                        <div className="text-body-secondary small">
                          Join a team that still has free slots
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="row g-3">
                        {joinableTeams.length > 0 ? (
                            joinableTeams.map((team) => {
                              const players = (team.players ?? []).filter(
                                  Boolean,
                              ) as Player[];
                              const member = players[0] ?? null;
                              const filled = players.length;
                              const dotClass = slotDotClass(filled);

                              return (
                                  <div
                                      className="col-12 col-md-6 col-lg-4"
                                      key={String(team.id)}
                                  >
                                    <div className="team-card">
                                      <div className="team-card-top d-flex justify-content-between align-items-start gap-2">
                                        <div className="min-w-0">
                                          <div className="team-name">{team.name}</div>

                                          <div className="team-meta">
                                    <span className="slot-chip">
                                      <span
                                          className={`slot-dot ${dotClass}`}
                                          aria-hidden="true"
                                      />
                                      {member ? (
                                          <>
                                            Member:{" "}
                                            <span className="fw-semibold">
                                            {playerShort(member)}
                                          </span>
                                          </>
                                      ) : (
                                          <>No member yet</>
                                      )}
                                    </span>
                                          </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            title={`Join ${team.name}`}
                                            disabled={joiningTeamId === String(team.id)}
                                            onClick={() =>
                                                handleJoinTeam(team.id, team.name as string)
                                            }
                                        >
                                  <span className="me-1" aria-hidden="true">
                                    ➕
                                  </span>
                                          {joiningTeamId === String(team.id)
                                              ? "Joining..."
                                              : "Join"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                              );
                            })
                        ) : (
                            <div className="col-12">
                              <div className="text-center text-body-secondary py-4">
                                No joinable teams available right now.
                              </div>
                            </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* All teams (joined_by_someone) */}
                  <section className="card shadow-sm mt-4">
                    <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                      <div className="min-w-0">
                        <strong className="fs-5">All teams</strong>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="row g-3">
                        {tournament.joinedBySomeone.length > 0 ? (
                            tournament.joinedBySomeone.map((team) => {
                              const players = (team.players ?? []).filter(
                                  Boolean,
                              ) as Player[];
                              const memberOne = players[0] ?? null;
                              const memberTwo = players[players.length - 1] ?? null;
                              const filled = players.length;
                              const dotClass = slotDotClass(filled);

                              return (
                                  <div
                                      className="col-12 col-md-6 col-lg-4"
                                      key={String(team.id)}
                                  >
                                    <div className="team-card">
                                      <div className="team-card-top">
                                        <div className="min-w-0">
                                          <div className="team-name">{team.name}</div>

                                          <div className="team-meta">
                                    <span className="slot-chip">
                                      <span
                                          className={`slot-dot ${dotClass}`}
                                          aria-hidden="true"
                                      />
                                      {memberOne ? (
                                          <span className="fw-semibold">
                                          {playerShort(memberOne)}
                                            {" — "}
                                            {memberOne === memberTwo
                                                ? ""
                                                : playerShort(memberTwo)}
                                        </span>
                                      ) : (
                                          <>No members yet</>
                                      )}
                                    </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                              );
                            })
                        ) : (
                            <div className="col-12">
                              <div className="text-center text-body-secondary py-4">
                                No teams available right now.
                              </div>
                            </div>
                        )}
                      </div>
                    </div>
                  </section>
                </>
            )}
          </div>
        </div>
      </div>
  );
}
