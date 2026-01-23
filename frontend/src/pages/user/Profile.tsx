import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { RoutesEnum } from "../../AppRoutes";
import { useAuth, User } from "../../contexts/AuthContext";
import { Player } from "../../generated/graphql";

function computeInitials(user?: User | null): string {
  if (!user) {
    return "";
  }
  const first = (user?.firstName || "").trim();
  const last = (user?.lastName || "").trim();
  const initials = [first, last]
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  if (initials) return initials;
  const email = (user?.email || "").trim();
  return email ? email.slice(0, 2).toUpperCase() : "U";
}

function normalizeRole(u?: User | null) {
  // Prefer explicit type if your API provides it
  const t = u?.__typename || u?.__typename;
  if (t === "Player") return "Player";
  if (t === "Organizer") return "Organizer";
  if (t === "Referee") return "Referee";

  // Fallback heuristic (adjust to your backend)
  return "User";
}

function computeAge(birthdate?: string | Date) {
  if (!birthdate) return null;
  const dob = new Date(birthdate);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age -= 1;

  return age;
}

function formatDate(date?: string | Date) {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  // Similar to Rails `l(date)` but locale-based:
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(d);
}

export default function Profile() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const initials = useMemo(() => computeInitials(user), [user]);
  const role = useMemo(() => normalizeRole(user), [user]);

  const fullName = useMemo(() => {
    const name = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    return name || user?.email || "";
  }, [user]);

  const age = useMemo(() => computeAge(user?.birthdate), [user?.birthdate]);

  const isPlayer = useMemo(() => normalizeRole(user) === "Player", [user]);

  const navLinks = useMemo(() => {
    const r = normalizeRole(user);

    if (r === "Player") {
      return [
        { label: "Homepage", href: RoutesEnum.PlayerHomePage },
        {
          label: "Tournament Registrations",
          href: RoutesEnum.PlayerTournamentRegistrations,
        },
        { label: "Booked Matches", href: RoutesEnum.PlayerBookedMatches },
      ].filter((x) => x.href);
    }

    if (r === "Organizer") {
      return [
        { label: "Homepage", href: RoutesEnum.OrganizerHomePage },
        {
          label: "Create tournament",
          href: RoutesEnum.OrganizerCreateTournament,
        },
      ].filter((x) => x.href);
    }

    if (r === "Referee") {
      return [{ label: "Homepage", href: RoutesEnum.RefereeHomePage }].filter(
        (x) => x.href,
      );
    }
  }, [user]);

  const roleHomepage = useMemo(() => {
    const role = normalizeRole(user);

    if (role === "Player") {
      return RoutesEnum.PlayerHomePage;
    }

    if (role === "Organizer") {
      return RoutesEnum.OrganizerHomePage;
    }

    if (role === "Referee") {
      return RoutesEnum.RefereeHomePage;
    }
  }, [user]);

  function handleSignOut() {
    logout();
  }

  return (
    <div className="profile-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to={roleHomepage as string}>
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
              {navLinks!.map((link) => (
                <Link key={link.label} className="nav-link" to={link.href!}>
                  {link.label}
                </Link>
              ))}

              <Link
                className="nav-link active"
                aria-current="page"
                to={RoutesEnum.Profile}
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Actions common to all users */}
        <section className="float-end">
          <button className="btn btn-primary" onClick={handleSignOut}>
            Sign out
          </button>
        </section>

        {/* Page header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h2 className="mb-1">Profile</h2>
            <div className="text-body-secondary">
              Your personal info and performance stats
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Left column: profile card */}
          <div className="col-12 col-lg-4">
            <section className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar" aria-hidden="true">
                    <span className="avatar-initials">{initials}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <h3 className="mb-0 fs-4 text-truncate">{fullName}</h3>
                      <span className="badge text-bg-primary">{role}</span>
                    </div>

                    <div className="text-body-secondary small text-truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="row g-3">
                  <div className="col-6">
                    <div className="detail-item">
                      <div className="detail-label">Name</div>
                      <div className="detail-value">
                        {user?.firstName || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="detail-item">
                      <div className="detail-label">Surname</div>
                      <div className="detail-value">
                        {user?.lastName || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="detail-item">
                      <div className="detail-label">Email</div>
                      <div className="detail-value">{user?.email || "-"}</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="detail-item">
                      <div className="detail-label">Gender</div>
                      <div className="detail-value">
                        {user?.gender
                          ? String(user.gender).replace(/_/g, " ")
                          : "-"}
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="detail-item">
                      <div className="detail-label">Age</div>
                      <div className="detail-value">{age ?? "-"}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="detail-item">
                      <div className="detail-label">Date of birth</div>
                      <div className="detail-value">
                        {formatDate(user?.birthdate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right column: stats (ONLY for players) */}
          <div className="col-12 col-lg-8">
            {isPlayer && (
              <section className="card shadow-sm mb-4">
                <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <strong className="fs-5">Performance</strong>
                </div>

                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="stat-card stat-card--win">
                        <div className="stat-top">
                          <span className="stat-icon" aria-hidden="true">
                            🏆
                          </span>
                          <span className="stat-label">Matches won</span>
                        </div>
                        <div className="stat-value">
                          {(user as Player).wonMatches?.length || 0}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="stat-card stat-card--loss">
                        <div className="stat-top">
                          <span className="stat-icon" aria-hidden="true">
                            🛡️
                          </span>
                          <span className="stat-label">Matches lost</span>
                        </div>
                        <div className="stat-value">
                          {(user as Player).lostMatches?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
