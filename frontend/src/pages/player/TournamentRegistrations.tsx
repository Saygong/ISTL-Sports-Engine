import React from "react";
import { RoutesEnum } from "../../AppRoutes.tsx";
import { Link } from "react-router";

type ID = string | number;

type Organizer = {
  organization_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

type Sport = {
  description?: string | null;
  variant_kind?: string | null;
};

type Court = {
  name?: string | null;
};

type Tournament = {
  name: string;
  sport: Sport;
  court?: Court | null;
  organizer?: Organizer | null;
};

type Match = {
  id: ID;
  round?: number | null;
  date?: string | Date | null;
  tournament: Tournament;
};

type ParticipantsByMatchId = Record<
  string,
  {
    left: string[];
    right: string[];
  }
>;

type Props = {
  matches: Match[];
  participantsByMatchId: ParticipantsByMatchId;
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

function organizerLabel(o?: Organizer | null): string {
  const org = (o?.organization_name ?? "").trim();
  if (org) return org;

  const first = (o?.first_name ?? "").trim();
  const last = (o?.last_name ?? "").trim();
  const name = `${first} ${last}`.trim();
  return name || "—";
}

const mockData: Props = {
  matches: [],
  participantsByMatchId: {},
};

export default function PlayerTournamentRegistrations() {
  const { matches, participantsByMatchId } = mockData;
  return (
    <div className="booked-page player-registrations-page">
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
                className="nav-link active"
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
        <div className="page-narrow">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
            <div className="min-w-0">
              <h2 className="mb-1">Your matches</h2>
              <div className="page-subtitle">
                Matches you are scheduled to play
              </div>
            </div>
          </div>

          <section className="card shadow-sm">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <strong className="fs-5">Upcoming matches</strong>
              <span className="text-body-secondary small">
                No actions available here
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Participants</th>
                    <th scope="col">Tournament</th>
                    <th scope="col">Round</th>
                    <th scope="col">Start date</th>
                    <th scope="col">Start time</th>
                    <th scope="col">Stadium</th>
                    <th scope="col">Organizer</th>
                  </tr>
                </thead>

                <tbody>
                  {matches.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-5 text-body-secondary"
                      >
                        No scheduled matches yet.
                      </td>
                    </tr>
                  ) : (
                    matches.map((m) => {
                      const mId = String(m.id);
                      const participants = participantsByMatchId[mId] ?? {
                        left: [],
                        right: [],
                      };

                      const sportLabel =
                        (m.tournament.sport.description &&
                          m.tournament.sport.description.trim()) ||
                        humanize(m.tournament.sport.variant_kind);

                      return (
                        <tr key={mId}>
                          <td>
                            <div className="participants">
                              <div className="team">
                                {participants.left.map((label, i) => (
                                  <span
                                    className="player"
                                    key={`${mId}-l-${i}`}
                                  >
                                    {label}
                                  </span>
                                ))}
                              </div>

                              <div className="vs">vs</div>

                              <div className="team">
                                {participants.right.map((label, i) => (
                                  <span
                                    className="player"
                                    key={`${mId}-r-${i}`}
                                  >
                                    {label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>

                          <td className="tournament-cell">
                            <div className="tournament-title">
                              {m.tournament.name}
                            </div>
                            <div className="tournament-sub">
                              <span className="sport-chip">{sportLabel}</span>
                            </div>
                          </td>

                          <td>
                            <span className="badge text-bg-secondary">
                              {m.round != null ? `Round ${m.round}` : "—"}
                            </span>
                          </td>

                          <td>{formatDateDMY(m.date)}</td>
                          <td>{formatTimeHM(m.date)}</td>
                          <td>{m.tournament.court?.name || "—"}</td>

                          <td>
                            <span className="org-chip">
                              {organizerLabel(m.tournament.organizer)}
                            </span>
                          </td>
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
}
