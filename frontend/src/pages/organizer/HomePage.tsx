import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { RoutesEnum } from "../../AppRoutes";
import { Player, useTournamentsAllQuery } from "../../generated/graphql";
import { playerShort } from "../player/TournamentDetail";
import { getWinnerName } from "../referee/HomePage";

type ID = string | number;

function humanize(s?: string): string {
  if (!s) return "—";
  // "variant_kind" style: snake_case -> Title case
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

function matchKey(id: ID): string {
  return String(id);
}

export default function OrganizerHomePage() {
  const [{ data: tournamentsData }] = useTournamentsAllQuery({
    variables: { search: {} },
  });
  const tournaments = tournamentsData?.tournamentsAll || [];

  const navigate = useNavigate();
  const hasTournaments = tournaments?.length > 0;

  // Optional: bootstrap accordion expects unique ids; we mimic ERB indexing.
  const accordionId = "organizerTournamentsAccordion";

  const tournamentView = useMemo(() => tournaments ?? [], [tournaments]);

  const redirectToCreateTournament = () => {
    navigate(RoutesEnum.OrganizerCreateTournament);
  };

  return (
    <div className="organizer-page">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to={RoutesEnum.OrganizerHomePage}>
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
              <Link
                className="nav-link active"
                to={RoutesEnum.OrganizerHomePage}
              >
                Homepage
              </Link>
              <Link
                className="nav-link"
                to={RoutesEnum.OrganizerCreateTournament}
              >
                Create tournament
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
              <h2 className="mb-1">Organizer homepage</h2>
              <div className="page-subtitle">
                Manage your tournaments and monitor match outcomes
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={redirectToCreateTournament}
              >
                <span className="me-1" aria-hidden="true">
                  ＋
                </span>{" "}
                Create tournament
              </button>
            </div>
          </div>

          <div className="accordion" id={accordionId}>
            {!hasTournaments && (
              <div className="text-body-secondary">No tournaments yet.</div>
            )}

            {tournamentView.map((t, idx) => {
              const headingId = `orgT${idx}Heading`;
              const collapseId = `orgT${idx}Collapse`;
              const expanded = idx === 0;

              return (
                <div className="accordion-item" key={String(t.id ?? idx)}>
                  <h2 className="accordion-header" id={headingId}>
                    <button
                      className={`accordion-button ${expanded ? "" : "collapsed"}`}
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
                            📅 {formatDateDMY(t.startDate)}
                          </span>
                          <span className="sport-chip">
                            {humanize(t.sport?.variantKind)}
                          </span>
                          <span className="meta-chip">
                            🏟️ {t.court?.name || "—"}
                          </span>
                        </div>
                      </div>
                    </button>
                  </h2>

                  <div
                    id={collapseId}
                    className={`accordion-collapse collapse ${expanded ? "show" : ""}`}
                    aria-labelledby={headingId}
                    data-bs-parent={`#${accordionId}`}
                  >
                    <div className="accordion-body">
                      <section className="section-block">
                        <div className="section-header">
                          <p className="section-title mb-0">Matches</p>
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
                                <th scope="col">Referee</th>
                                <th scope="col" className="action-end">
                                  Winner
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {(!t.matches || t.matches.length === 0) && (
                                <tr>
                                  <td
                                    colSpan={7}
                                    className="text-center py-4 text-body-secondary"
                                  >
                                    No matches.
                                  </td>
                                </tr>
                              )}

                              {(t.matches || []).map((m) => {
                                const mId = matchKey(m.id);
                                const participants: {
                                  left: Player[];
                                  right: Player[];
                                } = {
                                  // @ts-expect-error Player type is wrong-ish
                                  left: m.teams?.length
                                    ? m.teams[0].players
                                    : [],
                                  // @ts-expect-error Player type is wrong-ish
                                  right:
                                    m.teams?.length > 1
                                      ? m.teams[1].players
                                      : [],
                                };
                                const refereeName = m.referee
                                  ? `${m.referee.firstName ?? ""} ${
                                      m.referee.lastName ?? ""
                                    }`.trim() || "—"
                                  : "—";

                                return (
                                  <tr key={mId}>
                                    <td>
                                      <div className="participants">
                                        <div className="team">
                                          {participants.left.map(
                                            (player, i) => (
                                              <span
                                                className="player"
                                                key={`${mId}-l-${i}`}
                                              >
                                                {playerShort(player)}
                                              </span>
                                            ),
                                          )}
                                        </div>

                                        <div className="vs">vs</div>

                                        <div className="team">
                                          {participants.right.map(
                                            (player, i) => (
                                              <span
                                                className="player"
                                                key={`${mId}-r-${i}`}
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
                                        {m.round >= 0
                                          ? `Round ${m.round}`
                                          : "—"}
                                      </span>
                                    </td>

                                    <td>{formatDateDMY(m.date)}</td>
                                    <td>{formatTimeHM(m.date)}</td>
                                    <td>{t.court?.name || "—"}</td>

                                    <td>
                                      <span className="ref-chip">
                                        {refereeName}
                                      </span>
                                    </td>

                                    <td className="action-end">
                                      {m.winner ? (
                                        // @ts-expect-error winner type
                                        getWinnerName(m.winner)
                                      ) : (
                                        <span className="text-body-secondary">
                                          —
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
