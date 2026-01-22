import { Link, useNavigate } from "react-router";
import { RoutesEnum } from "../../AppRoutes";
import { useAuth } from "../../contexts/AuthContext";
import {
  Match,
  Player,
  Referee,
  useRefereedTournamentsQuery,
} from "../../generated/graphql";

type RoundByMatchId = Record<string, string>; // e.g. "Round 1" or "—"

type Props = {
  // Badge text for pending matches (ERB @round_by_match_id[m.id])
  roundByMatchId: RoundByMatchId;
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

function formatDateTimeDMYHM(value?: string | Date | null): string {
  const d = toDate(value);
  if (!d) return "—";
  const date = formatDateDMY(d);
  const time = formatTimeHM(d);
  return `${date} ${time}`;
}

function playerShort(p: Player): string {
  const firstInitial = (p.firstName ?? "").trim().slice(0, 1);
  const last = (p.lastName ?? "").trim();
  const label = `${firstInitial ? `${firstInitial}.` : ""} ${last}`.trim();
  return label || "—";
}

export default function RefereeHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [{ data: refereedTournamentsData }] = useRefereedTournamentsQuery();
  const tournaments = refereedTournamentsData
      ? (refereedTournamentsData.me as Referee).refereedTournaments
      : [];
  const hasTournaments = tournaments?.length > 0;

  const accordionId = "refereeTournamentsAccordion";

  const insertMatchResult = (id: string | number) => {
    navigate(RoutesEnum.RefereeMatchResult.replace(":id", id.toString()));
  };

  return (
      <div className="referee-page">
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
                <Link className="nav-link active" to={RoutesEnum.RefereeHomePage}>
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
                <h2 className="mb-1">Referee dashboard</h2>
                <div className="page-subtitle">
                  Tournaments and match status overview
                </div>
              </div>
            </div>

            <div className="accordion" id={accordionId}>
              {!hasTournaments ? (
                  <div className="text-center py-5 text-body-secondary">
                    No tournaments assigned.
                  </div>
              ) : (
                  tournaments.map((t, idx) => {
                    const headingId = `t${idx}Heading`;
                    const collapseId = `t${idx}Collapse`;
                    const expanded = idx === 0;

                    // Split matches by presence of result (ERB logic)
                    const { pending, finished } = (() => {
                      const p: Match[] = [];
                      const f: Match[] = [];

                      (t.matches || []).forEach((m) => {
                        const res = m.matchResult;
                        (res ? f : p).push(m);
                      });

                      return { pending: p, finished: f };
                    })();

                    const sportLabel =
                        (t.sport?.description && t.sport.description.trim()) ||
                        humanize(t.sport?.variantKind);

                    return (
                        <div className="accordion-item" key={String(t.id ?? idx)}>
                          <h2 className="accordion-header" id={headingId}>
                            <button
                                className={`accordion-button ${
                                    expanded ? "" : "collapsed"
                                }`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#${collapseId}`}
                                aria-expanded={expanded}
                                aria-controls={collapseId}
                            >
                              <div className="min-w-0">
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                  <p className="tournament-title mb-0">{t.name}</p>
                                </div>

                                <div className="tournament-meta">
                            <span className="meta-chip">
                              {formatDateDMY(t.startDate)}
                            </span>
                                  <span className="meta-chip">
                              🏟️ {t.court?.name || "—"}
                            </span>
                                  <span className="sport-chip">{sportLabel}</span>
                                </div>
                              </div>
                            </button>
                          </h2>

                          <div
                              id={collapseId}
                              className={`accordion-collapse collapse ${
                                  expanded ? "show" : ""
                              }`}
                              aria-labelledby={headingId}
                              data-bs-parent={`#${accordionId}`}
                          >
                            <div className="accordion-body">
                              {/* Pending */}
                              <section className="section-block mb-3">
                                <div className="section-header">
                                  <div className="d-flex align-items-center gap-2">
                              <span className="status-pill">
                                <span
                                    className="dot dot--live"
                                    aria-hidden="true"
                                />
                                Pending
                              </span>
                                    <p className="section-title mb-0">
                                      Pending matches
                                    </p>
                                  </div>
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
                                      <th scope="col" className="action-end">
                                        Action
                                      </th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {pending.length === 0 ? (
                                        <tr>
                                          <td
                                              colSpan={6}
                                              className="text-center py-4 text-body-secondary"
                                          >
                                            No pending matches.
                                          </td>
                                        </tr>
                                    ) : (
                                        pending.map((m) => {
                                          const mId = m.id;
                                          const participants: {
                                            left: Player[];
                                            right: Player[];
                                          } = {
                                            left: m.teams?.length
                                                ? m.teams[0].players
                                                : [],
                                            right:
                                                m.teams?.length > 1
                                                    ? m.teams[1].players
                                                    : [],
                                          };
                                          const roundLabel = m.round;
                                          const canInsertResults: boolean =
                                              m.referee?.id === user?.id &&
                                              !!participants.left?.length &&
                                              !!participants.right?.length;

                                          return (
                                              <tr key={mId}>
                                                <td>
                                                  <div className="participants">
                                                    <div className="team">
                                                      {participants.left.map(
                                                          (player, i2) => (
                                                              <span
                                                                  className="player"
                                                                  key={`${mId}-pl-${i2}`}
                                                              >
                                                    {playerShort(player)}
                                                  </span>
                                                          ),
                                                      )}
                                                    </div>

                                                    <div className="vs">vs</div>

                                                    <div className="team">
                                                      {participants.right.map(
                                                          (player, i2) => (
                                                              <span
                                                                  className="player"
                                                                  key={`${mId}-pr-${i2}`}
                                                              >
                                                    {playerShort(player)}
                                                  </span>
                                                          ),
                                                      )}
                                                    </div>
                                                  </div>
                                                </td>

                                                <td>
                                          <span className="badge text-bg-secondary">
                                            {roundLabel}
                                          </span>
                                                </td>

                                                <td>{formatDateDMY(m.date)}</td>
                                                <td>{formatTimeHM(m.date)}</td>
                                                <td>{t.court?.name || "—"}</td>

                                                <td className="action-end">
                                                  {canInsertResults && (
                                                      <button
                                                          className="btn btn-sm btn-outline-primary"
                                                          onClick={() =>
                                                              insertMatchResult(m.id)
                                                          }
                                                      >
                                                        Insert result
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

                              {/* Finished */}
                              <section className="section-block">
                                <div className="section-header">
                                  <div className="d-flex align-items-center gap-2">
                              <span className="status-pill">
                                <span
                                    className="dot dot--done"
                                    aria-hidden="true"
                                />
                                Finished
                              </span>
                                    <p className="section-title mb-0">
                                      Completed matches
                                    </p>
                                  </div>
                                </div>

                                <div className="table-responsive">
                                  <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                    <tr>
                                      <th scope="col">Match</th>
                                      <th scope="col">Date</th>
                                      <th scope="col">Result</th>
                                      <th scope="col">Winner</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {finished.length === 0 ? (
                                        <tr>
                                          <td
                                              colSpan={4}
                                              className="text-center py-4 text-body-secondary"
                                          >
                                            No completed matches.
                                          </td>
                                        </tr>
                                    ) : (
                                        finished.map((m) => {
                                          const mId = m.id;
                                          const resLabel = m.matchResult || "—";

                                          const leftTeam =
                                              m.teams?.[0]?.players ?? [];
                                          const rightTeam =
                                              m.teams?.[m.teams.length - 1]?.players ??
                                              [];

                                          return (
                                              <tr key={mId}>
                                                <td>
                                                  <div className="participants">
                                                    <div className="team">
                                                      {leftTeam.map((p, i2) => (
                                                          <span
                                                              className="player"
                                                              key={`${mId}-fl-${i2}`}
                                                          >
                                                  {playerShort(p)}
                                                </span>
                                                      ))}
                                                    </div>

                                                    <div className="vs">vs</div>

                                                    <div className="team">
                                                      {rightTeam.map((p, i2) => (
                                                          <span
                                                              className="player"
                                                              key={`${mId}-fr-${i2}`}
                                                          >
                                                  {playerShort(p)}
                                                </span>
                                                      ))}
                                                    </div>
                                                  </div>
                                                </td>

                                                <td>{formatDateTimeDMYHM(m.date)}</td>
                                                <td>{resLabel}</td>
                                                {/* TODO: double? */}
                                                <td>{m.winner?.name}</td>
                                              </tr>
                                          );
                                        })
                                    )}
                                    </tbody>
                                  </table>
                                </div>
                              </section>
                            </div>
                          </div>
                        </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
