import React, { useMemo, useState } from "react";
import { RoutesEnum } from "../../AppRoutes.tsx";
import { Link } from "react-router";

type ID = string | number;

type SportOption = { id: ID; description: string };
type CourtOption = { id: ID; name: string };
type RefereeOption = { id: ID; first_name?: string; last_name?: string };

type TournamentDraft = {
  name: string;
  sport_id: string;
  start_date: string; // yyyy-mm-dd
  court_id: string;
  min_age: string;
  max_age: string;
  gender: string;
  composition: string;
  number_of_matches: string;
};

type Props = {
  sports: SportOption[];
  courts: CourtOption[];
  referees: RefereeOption[];

  genderOptions: Array<{ label: string; value: string }>;
  compositionOptions: Array<{ label: string; value: string }>;

  // Optional initial values (when Rails passed @tournament with defaults)
  initialTournament?: Partial<TournamentDraft>;
  initialRefereeIds?: [string, string, string];

  onCreated?: () => void; // optional callback after successful create
};

function fullName(r: RefereeOption): string {
  const fn = (r.first_name ?? "").trim();
  const ln = (r.last_name ?? "").trim();
  const name = `${fn} ${ln}`.trim();
  return name || String(r.id);
}

function getCsrfToken(): string | null {
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") ?? null
  );
}

const mockData: Props = {
  sports: [],
  courts: [],
  referees: [],

  genderOptions: [
    {
      label: "",
      value: "",
    },
  ],
  compositionOptions: [
    {
      label: "",
      value: "",
    },
  ],
  initialTournament: {},
  initialRefereeIds: ["0", "1", "2"],
};

export default function OrganizerCreateTournament() {
  const {
    sports,
    courts,
    referees,
    genderOptions,
    compositionOptions,
    initialTournament,
    initialRefereeIds,
    onCreated,
  } = mockData;
  const [tournament, setTournament] = useState<TournamentDraft>(() => ({
    name: initialTournament?.name ?? "",
    sport_id: initialTournament?.sport_id ?? "",
    start_date: initialTournament?.start_date ?? "",
    court_id: initialTournament?.court_id ?? "",
    min_age: initialTournament?.min_age ?? "",
    max_age: initialTournament?.max_age ?? "",
    gender: initialTournament?.gender ?? "",
    composition: initialTournament?.composition ?? "",
    number_of_matches: initialTournament?.number_of_matches ?? "",
  }));

  // exactly 3 selects, just like the ERB
  const [refereeIds, setRefereeIds] = useState<[string, string, string]>(() => {
    return initialRefereeIds ?? ["", "", ""];
  });

  const selectedRefSet = useMemo(() => {
    return new Set(refereeIds.filter((v) => v && v.trim() !== ""));
  }, [refereeIds]);

  const isOptionDisabled = (optionValue: string, selectIndex: number) => {
    if (!optionValue) return false; // allow "None"
    // disable if selected elsewhere, but not if it is the current value
    return (
      selectedRefSet.has(optionValue) && refereeIds[selectIndex] !== optionValue
    );
  };

  const handleTournamentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTournament((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefereeChange = (index: 0 | 1 | 2, value: string) => {
    setRefereeIds((prev) => {
      const next: [string, string, string] = [...prev] as any;
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // const anySelected = refereeIds.some((v) => v && v.trim() !== "");
    // if (!anySelected) {
    //   alert("Please select at least 1 referee.");
    //   return;
    // }
    // // If you want to validate min<=max on frontend too (backend still required)
    // // const min = Number(tournament.min_age), max = Number(tournament.max_age);
    // // if (Number.isFinite(min) && Number.isFinite(max) && min > max) { ... }
    // const csrf = getCsrfToken();
    // // Rails expects params like:
    // // tournament[name]=... etc and referee_ids[]=1&referee_ids[]=2...
    // const body = new URLSearchParams();
    // Object.entries(tournament).forEach(([k, v]) => body.append(`tournament[${k}]`, v));
    // refereeIds.forEach((id) => body.append("referee_ids[]", id)); // include blanks like ERB does
    // const res = await fetch(routes.createTournament, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    //     ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    //   },
    //   credentials: "same-origin",
    //   body: body.toString(),
    // });
    // if (res.ok) {
    //   onCreated?.();
    //   // Common Rails behavior is redirect; if you return HTML redirect, fetch won't follow in SPA way.
    //   // If your backend returns JSON, you can redirect based on it.
    //   // Here we fallback to organizer home:
    //   window.location.href = routes.organizerHome;
    //   return;
    // }
    // // Best-effort error handling
    // const text = await res.text().catch(() => "");
    // console.error("Create tournament failed:", res.status, text);
    // alert("Could not create tournament. Please check the form and try again.");
  };

  return (
    <div className="organizer-create-page">
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
              <Link className="nav-link" to={RoutesEnum.OrganizerHomePage}>
                Homepage
              </Link>
              <Link
                className="nav-link active"
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
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
            <div className="min-w-0">
              <h2 className="mb-1">Create tournament</h2>
              <div className="page-subtitle">
                Fill the details and generate your tournament structure
              </div>
            </div>
          </div>

          {/* Form card */}
          <section className="card shadow-sm">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <strong className="fs-5">Tournament form</strong>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="d-grid gap-3">
                  {/* Core info */}
                  <section className="section-block">
                    <div className="section-header">
                      <p className="section-title mb-0">General info</p>
                    </div>

                    <div className="p-3">
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="tName">
                            Tournament name
                          </label>
                          <input
                            id="tName"
                            name="name"
                            className="form-control"
                            placeholder="e.g. Wimbledon"
                            required
                            value={tournament.name}
                            onChange={handleTournamentChange}
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="tSport">
                            Sport type
                          </label>
                          <select
                            id="tSport"
                            name="sport_id"
                            className="form-select"
                            required
                            value={tournament.sport_id}
                            onChange={handleTournamentChange}
                          >
                            <option value="">Select sport</option>
                            {sports.map((s) => (
                              <option key={String(s.id)} value={String(s.id)}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="tStart">
                            Start date
                          </label>
                          <input
                            id="tStart"
                            name="start_date"
                            type="date"
                            className="form-control"
                            required
                            value={tournament.start_date}
                            onChange={handleTournamentChange}
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="tStadium">
                            Stadium
                          </label>
                          <select
                            id="tStadium"
                            name="court_id"
                            className="form-select"
                            required
                            value={tournament.court_id}
                            onChange={handleTournamentChange}
                          >
                            <option value="">Select stadium</option>
                            {courts.map((c) => (
                              <option key={String(c.id)} value={String(c.id)}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Age restrictions */}
                        <div className="col-12 col-md-3">
                          <label className="form-label" htmlFor="minAge">
                            Min age
                          </label>
                          <input
                            id="minAge"
                            name="min_age"
                            type="number"
                            className="form-control"
                            min={0}
                            step={1}
                            placeholder="e.g. 16"
                            required
                            value={tournament.min_age}
                            onChange={handleTournamentChange}
                          />
                        </div>

                        <div className="col-12 col-md-3">
                          <label className="form-label" htmlFor="maxAge">
                            Max age
                          </label>
                          <input
                            id="maxAge"
                            name="max_age"
                            type="number"
                            className="form-control"
                            min={0}
                            step={1}
                            placeholder="e.g. 45"
                            required
                            value={tournament.max_age}
                            onChange={handleTournamentChange}
                          />
                        </div>

                        {/* Gender */}
                        <div className="col-12 col-md-3">
                          <label className="form-label" htmlFor="tGender">
                            Participants gender
                          </label>
                          <select
                            id="tGender"
                            name="gender"
                            className="form-select"
                            required
                            value={tournament.gender}
                            onChange={handleTournamentChange}
                          >
                            <option value="">Select gender</option>
                            {genderOptions.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Single or Double based */}
                        <div className="col-12 col-md-3">
                          <label className="form-label" htmlFor="matchMode">
                            Match mode
                          </label>
                          <select
                            id="matchMode"
                            name="composition"
                            className="form-select"
                            required
                            value={tournament.composition}
                            onChange={handleTournamentChange}
                          >
                            <option value="">Select mode</option>
                            {compositionOptions.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12">
                          <div className="form-text">
                            Note: validate that <strong>min age</strong> ≤{" "}
                            <strong>max age</strong> on the backend.
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Referees */}
                  <section className="section-block">
                    <div className="section-header">
                      <p className="section-title mb-0">Referees</p>
                      <span className="text-body-secondary small">
                        Select up to 3
                      </span>
                    </div>

                    <div className="p-3">
                      <div className="row g-3">
                        {[0, 1, 2].map((i) => (
                          <div className="col-12 col-md-4" key={i}>
                            <label className="form-label">
                              Referee #{i + 1}
                            </label>
                            <select
                              className="form-select"
                              value={refereeIds[i]}
                              onChange={(e) =>
                                handleRefereeChange(
                                  i as 0 | 1 | 2,
                                  e.target.value,
                                )
                              }
                              // name kept for parity if you ever submit normally (not needed for fetch)
                              name="referee_ids[]"
                            >
                              <option value="">None</option>
                              {referees.map((r) => {
                                const val = String(r.id);
                                return (
                                  <option
                                    key={val}
                                    value={val}
                                    disabled={isOptionDisabled(val, i)}
                                  >
                                    {fullName(r)}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Matches config */}
                  <section className="section-block">
                    <div className="section-header">
                      <p className="section-title mb-0">Match configuration</p>
                    </div>

                    <div className="p-3">
                      <div className="row g-3 align-items-end">
                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="numMatches">
                            Number of matches
                          </label>
                          <select
                            id="numMatches"
                            name="number_of_matches"
                            className="form-select"
                            required
                            value={tournament.number_of_matches}
                            onChange={handleTournamentChange}
                          >
                            <option value="">Select amount</option>
                            {["2", "4", "8", "16"].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>

                          <div className="form-text">
                            Example: 8 matches = 16 participants (individual) or
                            32 partecipants (16 teams).
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Actions */}
                  <div className="actions-bar">
                    <Link
                      className="btn btn-outline-secondary"
                      to={RoutesEnum.OrganizerHomePage}
                    >
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
