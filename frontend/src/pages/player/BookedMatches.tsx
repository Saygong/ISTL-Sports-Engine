import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { RoutesEnum } from "../../AppRoutes.tsx";

type ID = string | number;

type Player = {
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
};

type Field = {
  max_seats?: number | null;
};

type Match = {
  id: ID;
  round?: number | null;
  date?: string | Date | null;
  tournament: Tournament;
  field?: Field | null;

  // Prefer passing count instead of viewers array
  viewersCount?: number;
  viewers?: unknown[];
};

type ParticipantsByMatchId = Record<
  string,
  {
    left: Player[];
    right: Player[];
  }
>;

type Props = {
  matches: Match[];
  participantsByMatchId: ParticipantsByMatchId;

  onUnbooked?: (matchId: ID) => void; // optional callback
};

function getCsrfToken(): string | null {
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") ?? null
  );
}

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

function playerShort(p: Player): string {
  const fi = (p.first_name ?? "").trim().slice(0, 1);
  const ln = (p.last_name ?? "").trim();
  const label = `${fi ? `${fi}.` : ""} ${ln}`.trim();
  return label || "—";
}

async function deleteRequest(url: string) {
  const csrf = getCsrfToken();
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    },
    credentials: "same-origin",
  });
  return res;
}

const mockData: Props = {
  matches: [],
  participantsByMatchId: {},
};

export default function PlayerBookedMatches() {
  const { matches, participantsByMatchId, onUnbooked } = mockData;
  const [unbookingId, setUnbookingId] = useState<string | null>(null);

  const handleUnbook = async (matchId: ID) => {
    // const ok = window.confirm("Unbook this match?");
    // if (!ok) return;
    // const key = String(matchId);
    // setUnbookingId(key);
    // try {
    //   const res = await deleteRequest(routes.unbookMatch(matchId));
    //   if (res.ok) {
    //     onUnbooked?.(matchId);
    //     window.location.reload(); // simplest Rails-parity
    //     return;
    //   }
    //   const text = await res.text().catch(() => "");
    //   console.error("Unbook failed:", res.status, text);
    //   alert("Could not unbook. Please try again.");
    // } finally {
    //   setUnbookingId(null);
    // }
  };

  const rows = useMemo(() => matches ?? [], [matches]);

  return (
    <div className="booked-page">
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
              <Link
                className="nav-link active"
                to={RoutesEnum.PlayerBookedMatches}
              >
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
              <h2 className="mb-1">Booked matches</h2>
              <div className="page-subtitle">
                These are the matches you reserved tickets for
              </div>
            </div>
          </div>

          <section className="card shadow-sm">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <strong className="fs-5">Your reservations</strong>
              <span className="text-body-secondary small">
                Only unbooking is available here
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
                    <th scope="col">Seats</th>
                    <th scope="col" className="text-end">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-5 text-body-secondary"
                      >
                        No booked matches yet.
                      </td>
                    </tr>
                  ) : (
                    rows.map((m) => {
                      const mId = String(m.id);
                      const participants = participantsByMatchId[mId] ?? {
                        left: [],
                        right: [],
                      };

                      const maxSeats = Number(m.field?.max_seats ?? 0) || 0;
                      const used = m.viewersCount ?? m.viewers?.length ?? 0;
                      const available = Math.max(maxSeats - used, 0);
                      const lowSeats = available <= 20;

                      const sportLabel =
                        (m.tournament.sport.description &&
                          m.tournament.sport.description.trim()) ||
                        humanize(m.tournament.sport.variant_kind);

                      return (
                        <tr key={mId}>
                          <td>
                            <div className="participants">
                              <div className="team">
                                {participants.left.map((p, i) => (
                                  <span
                                    className="player"
                                    key={`${mId}-l-${i}`}
                                  >
                                    {playerShort(p)}
                                  </span>
                                ))}
                              </div>
                              <div className="vs">vs</div>
                              <div className="team">
                                {participants.right.map((p, i) => (
                                  <span
                                    className="player"
                                    key={`${mId}-r-${i}`}
                                  >
                                    {playerShort(p)}
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
                              {m.round ?? "—"}
                            </span>
                          </td>

                          <td>{formatDateDMY(m.date)}</td>
                          <td>{formatTimeHM(m.date)}</td>
                          <td>{m.tournament.court?.name || "—"}</td>

                          <td>
                            <span
                              className={`seat-pill ${lowSeats ? "seat-pill--low" : ""}`}
                            >
                              <span className="seat-dot" aria-hidden="true" />
                              {available} available
                            </span>
                          </td>

                          <td className="text-end">
                            <span className="action-stack">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleUnbook(m.id)}
                                disabled={unbookingId === mId}
                              >
                                {unbookingId === mId
                                  ? "Unbooking..."
                                  : "Unbook"}
                              </button>
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
