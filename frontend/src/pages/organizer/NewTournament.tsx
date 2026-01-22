import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { RoutesEnum } from "../../AppRoutes";
import {
  CompositionEnum,
  GenderEnum,
  useCourtsAllQuery,
  useCreateTournamentMutation,
  useRefereesAllQuery,
  UserInterface,
  useSportsQuery,
} from "../../generated/graphql";

type TournamentDraft = {
  name: string;
  sport_id: string;
  start_date: string; // yyyy-mm-dd
  court_id: string;
  min_age: number;
  max_age: number;
  gender: string;
  composition: string;
  number_of_matches: number;
};

type Props = {
  genderOptions: Array<{ label: string; value: string }>;
  compositionOptions: Array<{ label: string; value: string }>;

  // Optional initial values (when Rails passed @tournament with defaults)
  initialTournament?: Partial<TournamentDraft>;
  initialRefereeIds?: [string, string, string];

  onCreated?: () => void; // optional callback after successful create
};

function fullName(r: UserInterface): string {
  const fn = (r.firstName ?? "").trim();
  const ln = (r.lastName ?? "").trim();
  const name = `${fn} ${ln}`.trim();
  return name || String(r.id);
}

const mockData: Props = {
  genderOptions: [
    {
      label: "Female",
      value: GenderEnum.Female,
    },
    {
      label: "Male",
      value: GenderEnum.Male,
    },
  ],
  compositionOptions: [
    {
      label: "Single",
      value: CompositionEnum.Single,
    },
    {
      label: "Double",
      value: CompositionEnum.Double,
    },
  ],
  initialTournament: {},
};

export default function OrganizerCreateTournament() {
  const { genderOptions, compositionOptions, initialTournament } = mockData;
  const navigate = useNavigate();
  const [{ data: sportsData }] = useSportsQuery();
  const sports = sportsData?.sportsAll;
  //
  const [{ data: refereesData }] = useRefereesAllQuery();
  const referees = refereesData?.refereesAll;
  //
  const [{ data: courtsData }] = useCourtsAllQuery();
  const courts = courtsData?.courtsAll;

  const [, createTournamentMutation] = useCreateTournamentMutation();

  const [tournament, setTournament] = useState<TournamentDraft>(() => ({
    name: initialTournament?.name ?? "",
    sport_id: initialTournament?.sport_id ?? "",
    start_date: initialTournament?.start_date ?? "",
    court_id: initialTournament?.court_id ?? "",
    min_age: initialTournament?.min_age ?? 0,
    max_age: initialTournament?.max_age ?? 100,
    gender: initialTournament?.gender ?? "",
    composition: initialTournament?.composition ?? "",
    number_of_matches: initialTournament?.number_of_matches ?? 2,
  }));

  // exactly 3 selects, just like the ERB
  const [refereeIds, setRefereeIds] = useState<[string, string, string]>(() => {
    return ["", "", ""];
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

  const handleSubmit = async () => {
    const anySelected = refereeIds.some((v) => v && v.trim() !== "");
    // validate referees
    if (!anySelected) {
      alert("Please select at least 1 referee.");
      return;
    }
    // validate age
    const min = Number(tournament.min_age),
        max = Number(tournament.max_age);
    if (Number.isFinite(min) && Number.isFinite(max) && min > max) {
      alert("Min age is greater than max age.");
      return;
    }

    const res = await createTournamentMutation({
      args: {
        name: tournament.name,
        startDate: tournament.start_date,
        minAge: tournament.min_age,
        maxAge: tournament.max_age,
        numberOfMatches: tournament.number_of_matches,
        gender: tournament.gender as GenderEnum,
        composition: tournament.composition as CompositionEnum,
        referees: refereeIds
            .map(Number)
            .filter((n) => n > 0) as unknown as string[],
        sport: Number(tournament.sport_id) as unknown as string,
        court: Number(tournament.court_id) as unknown as string,
      },
    });

    if (res.data?.createTournament) {
      navigate(RoutesEnum.OrganizerHomePage);
    }
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
                <div>
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
                              {sports?.map((s) => (
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
                              {courts?.map((c) => (
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
                                  {referees?.map((r) => {
                                    const val = String(r.id);
                                    return (
                                        <option
                                            key={val}
                                            value={val}
                                            disabled={isOptionDisabled(val, i)}
                                        >
                                          {/* @ts-expect-error type mismatch user interface */}
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
                      <button onClick={handleSubmit} className="btn btn-primary">
                        Save
                      </button>
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
