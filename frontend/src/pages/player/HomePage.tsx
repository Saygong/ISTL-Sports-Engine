import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { RoutesEnum } from "../../AppRoutes.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { Organizer, Tournament, UserUnion, useSportsQuery, useTournamentsAllQuery } from "../../generated/graphql.tsx";

type ID = string | number;

type SportOption = { id: ID; description: string };

type Filters = {
  name?: string;
  sport_id?: string;
  start_date?: string; // yyyy-mm-dd
};

type Props = {
  sports: SportOption[];
  // tournaments: Tournament[];

  // ERB: @eligibility_by_tournament_id[t.id] => boolean
  //eligibilityByTournamentId: Record<string, boolean>;

  // Optional: initial filters (like params[:name], params[:sport_id], params[:start_date])
  initialFilters?: Partial<Filters>;

  /**
   * If you want the filters to trigger navigation (GET params) like Rails form_with method :get,
   * provide onApplyFilters. Otherwise it filters locally.
   */
  onApplyFilters?: (filters: Filters) => void;
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

function organizerLabel(o?: Organizer | null): string {
  const first = (o?.firstName ?? "").trim();
  const last = (o?.lastName ?? "").trim();
  const name = `${first} ${last}`.trim();
  return name || "—";
}

function calculateAge(birthdate: string): number {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function isEligible(user: UserUnion | null, tournament?: Tournament | null): boolean {
  if (!user || !tournament) return false;

  if (user.gender !== tournament.gender) return false;

  const age = calculateAge(user.birthdate);
  if (age < tournament.minAge) return false;
  if (age > tournament.maxAge) return false;

  return true;
}

const mockData: Props = {
  sports: [],
  initialFilters: {},
};

export default function PlayerHomePage() {
  const {
    initialFilters,
    onApplyFilters,
  } = mockData;

  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(() => ({
    name: initialFilters?.name,
    sport_id: initialFilters?.sport_id,
    start_date: initialFilters?.start_date,
  }));

  const { user } = useAuth();
  const shouldPause = Object.values(filters).some(value => !!value);
  const [{ data: tournamentsData }, reExecuteTournamentsAll] = useTournamentsAllQuery({
      variables: { search: {
        name: filters.name,
        sportId: filters.sport_id,
        startDate: filters.start_date,
       }},
      pause: shouldPause,
  });
  const tournaments = tournamentsData?.tournamentsAll || [];
  const eligibilityByTournamentId: Record<string, boolean> = useMemo(() => {
    const result: Record<string, boolean> = {};

    if (!tournaments.length) return result;

    tournaments.forEach(t => {
      // @ts-expect-error tournament.Organizer type is wrong-ish
      const eligible: boolean = isEligible(user, t);
      result[t.id] = eligible;
    })


    return result;
  }, [tournaments]);

  const [{ data: sportsData }] = useSportsQuery();
  const sports = sportsData?.sportsAll;

  // const filteredTournaments = useMemo(() => {
  //   // If caller wants server-side filtering, we still render all passed tournaments.
  //   // Local filtering is a convenience when onApplyFilters isn't provided.
  //   if (onApplyFilters) return tournaments;

  //   const nameNeedle = filters.name.trim().toLowerCase();
  //   const sportId = filters.sport_id.trim();
  //   const startDate = filters.start_date.trim(); // yyyy-mm-dd

  //   return tournaments.filter((t) => {
  //     if (nameNeedle && !t.name.toLowerCase().includes(nameNeedle))
  //       return false;

  //     if (sportId) {
  //       const tSportId = t.sport?.id != null ? String(t.sport.id) : "";
  //       if (tSportId !== sportId) return false;
  //     }

  //     if (startDate) {
  //       const d = toDate(t.start_date);
  //       if (!d) return false;

  //       // Compare yyyy-mm-dd in local time
  //       const y = d.getFullYear();
  //       const m = String(d.getMonth() + 1).padStart(2, "0");
  //       const day = String(d.getDate()).padStart(2, "0");
  //       const key = `${y}-${m}-${day}`;

  //       if (key !== startDate) return false;
  //     }

  //     return true;
  //   });
  // }, [tournaments, filters, onApplyFilters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    // onApplyFilters?.(filters);
    reExecuteTournamentsAll();
  };

  const handleReset = () => {
    const next: Filters = { name: "", sport_id: "", start_date: "" };
    setFilters(next);
    onApplyFilters?.(next);
    // If you want strict Rails behavior, you could also navigate:
    // window.location.href = routes.playerHome;
  };

  const openTournamentDetail = (id: string | number) => {
    navigate(RoutesEnum.PlayerTournamentDetail.replace(":id", id.toString()));
  };

  return (
    <div className="player-page">
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
              <Link className="nav-link active" to={RoutesEnum.PlayerHomePage}>
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
        <div className="page-narrow">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
            <div className="min-w-0">
              <h2 className="mb-1">Player homepage</h2>
              <div className="page-subtitle">
                Browse tournaments and check your eligibility
              </div>
            </div>
          </div>

          {/* Filters */}
          <section className="card shadow-sm filters-card mb-3">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <strong className="fs-5">Filters</strong>
            </div>

            <div className="card-body">
              <form onSubmit={handleApply}>
                <div className="row g-3 align-items-end">
                  <div className="col-12 col-md-4">
                    <label htmlFor="filterName" className="form-label">
                      Name
                    </label>
                    <input
                      id="filterName"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Wimbledon"
                      value={filters.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label htmlFor="filterSport" className="form-label">
                      Sport
                    </label>
                    <select
                      id="filterSport"
                      name="sport_id"
                      className="form-select"
                      value={filters.sport_id}
                      onChange={handleChange}
                    >
                      <option value=''>All sports</option>
                      {sports?.map((s) => (
                        <option key={String(s.id)} value={String(s.id)}>
                          {s.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-4">
                    <label htmlFor="filterStartDate" className="form-label">
                      Start date
                    </label>
                    <input
                      id="filterStartDate"
                      name="start_date"
                      type="date"
                      className="form-control"
                      value={filters.start_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-md-4 d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Apply
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* Tournaments table */}
          <section className="card shadow-sm table-card">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <strong className="fs-5">Tournaments</strong>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Tournament</th>
                    <th scope="col">Sport</th>
                    <th scope="col">Start date</th>
                    <th scope="col">Organizer</th>
                    <th scope="col">Eligibility</th>
                    <th scope="col" className="text-end">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tournaments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-5 text-body-secondary"
                      >
                        No tournaments found.
                      </td>
                    </tr>
                  ) : (
                    tournaments.map((t) => {
                      const eligible =
                        !!eligibilityByTournamentId[String(t.id)];

                      const sportLabel =
                        (t.sport.description && t.sport.description.trim()) ||
                        humanize(t.sport.variantKind);

                      return (
                        <tr key={String(t.id)}>
                          <th scope="row">{t.name}</th>

                          <td>
                            <span className="sport-chip">{sportLabel}</span>
                          </td>

                          <td>{formatDateDMY(t.startDate)}</td>

                          <td>
                            <span className="org-chip">
                              {/* @ts-expect-error organizer type wrong */}
                              {organizerLabel(t.organizer)}
                            </span>
                          </td>

                          <td>
                            {eligible ? (
                              <span className="elig-pill">
                                <span
                                  className="elig-dot elig-dot--ok"
                                  aria-hidden="true"
                                />
                                Eligible
                              </span>
                            ) : (
                              <span className="elig-pill">
                                <span
                                  className="elig-dot elig-dot--no"
                                  aria-hidden="true"
                                />
                                Not eligible
                              </span>
                            )}
                          </td>

                          <td className="text-end">
                            <button
                              className="action-btn btn btn-sm btn-outline-primary"
                              onClick={() => openTournamentDetail(t.id)}
                            >
                              Details
                            </button>
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


