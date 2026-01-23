/**
 * UniversalSkeletonPage
 * A single “works-everywhere” skeleton/shimmer that matches all your pages:
 * - Navbar skeleton
 * - Page header skeleton
 * - Optional filters card skeleton
 * - Optional accordion skeleton
 * - Optional table skeleton
 * - Optional form skeleton (auth + create tournament + result form)
 *
 * Uses Bootstrap utility classes + tiny inline CSS for shimmer.
 *
 * Usage examples:
 * <UniversalSkeletonPage variant="table" />
 * <UniversalSkeletonPage variant="form" />
 * <UniversalSkeletonPage variant="accordion" />
 * <UniversalSkeletonPage variant="auth" />
 * <UniversalSkeletonPage variant="detailTable" />
 */

type Variant =
  | "table"
  | "filters+table"
  | "accordion"
  | "form"
  | "auth"
  | "detailTable";

type Props = {
  variant?: Variant;

  // Optional knobs
  showNavbar?: boolean;
  showHeaderMetaChips?: boolean; // tournament detail / referee result chips
  rows?: number; // table rows
  accordionItems?: number;
  formFields?: number; // generic form fields
};

const styles = `
/* Minimal shimmer */
.skel {
  position: relative;
  overflow: hidden;
  background-color: rgba(0,0,0,.08);
  border-radius: .5rem;
}
.skel::after {
  content: "";
  position: absolute;
  top: 0; left: -150%;
  height: 100%;
  width: 150%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,.35),
    transparent
  );
  animation: skelShimmer 1.2s infinite;
}
@keyframes skelShimmer {
  0% { left: -150%; }
  100% { left: 150%; }
}

/* Sizes */
.skel-line { height: 12px; border-radius: 999px; }
.skel-title { height: 28px; border-radius: .5rem; }
.skel-chip { height: 22px; border-radius: 999px; }
.skel-btn { height: 38px; border-radius: .5rem; }
.skel-input { height: 38px; border-radius: .5rem; }
.skel-textarea { height: 96px; border-radius: .5rem; }

.skel-avatar { width: 56px; height: 56px; border-radius: 50%; }
`;

function Skel({
  className = "",
  style = {},
}: {
  className?: string;
  style?: Record<string, string | number | (string & {})>;
}) {
  return <div className={`skel ${className}`} style={style} />;
}

function repeat(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

export default function UniversalSkeletonPage({
  variant = "table",
  showNavbar = true,
  showHeaderMetaChips = false,
  rows = 6,
  accordionItems = 3,
  formFields = 6,
}: Props) {
  return (
    <div className="w-100">
      <style>{styles}</style>

      {showNavbar && (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <div className="d-flex align-items-center gap-2">
              <Skel className="skel-line" />
              <div style={{ width: 120 }}>
                <Skel className="skel-line" />
              </div>
            </div>

            <div className="d-none d-lg-flex gap-3">
              {repeat(4).map((i) => (
                <div key={i} style={{ width: 110 }}>
                  <Skel className="skel-line" />
                </div>
              ))}
            </div>

            <div className="d-lg-none">
              <Skel className="skel-btn" style={{ width: 44 }} />
            </div>
          </div>
        </nav>
      )}

      <div className="container py-4">
        <div className="page-narrow mx-auto">
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
            <div className="min-w-0" style={{ flex: "1 1 320px" }}>
              <Skel className="skel-title mb-2" style={{ width: "260px" }} />
              <Skel className="skel-line" style={{ width: "340px" }} />
            </div>

            {/* Actions / chips */}
            <div className="d-flex flex-wrap gap-2">
              {showHeaderMetaChips && (
                <>
                  <Skel className="skel-chip" style={{ width: 180 }} />
                  <Skel className="skel-chip" style={{ width: 120 }} />
                  <Skel className="skel-chip" style={{ width: 120 }} />
                </>
              )}
              <Skel className="skel-btn" style={{ width: 160 }} />
            </div>
          </div>

          {/* AUTH variants (Login / Sign up / Forgot / Change password) */}
          {variant === "auth" && (
            <div className="all-centered full-height">
              <div className="card shadow-sm w-100" style={{ maxWidth: 520 }}>
                <div className="card-body">
                  <Skel className="skel-title mb-3" style={{ width: 180 }} />
                  {repeat(3).map((i) => (
                    <div className="mb-3" key={i}>
                      <Skel className="skel-line mb-2" style={{ width: 110 }} />
                      <Skel className="skel-input" />
                    </div>
                  ))}
                  <Skel className="skel-btn mt-2" style={{ width: "100%" }} />
                  <div className="mt-3 d-grid gap-2">
                    {repeat(3).map((i) => (
                      <Skel
                        key={i}
                        className="skel-line"
                        style={{ width: "70%" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FILTERS + TABLE (Player homepage) */}
          {variant === "filters+table" && (
            <>
              <section className="card shadow-sm mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <Skel className="skel-line" style={{ width: 120 }} />
                  <Skel className="skel-chip" style={{ width: 160 }} />
                </div>
                <div className="card-body">
                  <div className="row g-3 align-items-end">
                    {repeat(3).map((i) => (
                      <div className="col-12 col-md-4" key={i}>
                        <Skel
                          className="skel-line mb-2"
                          style={{ width: 90 }}
                        />
                        <Skel className="skel-input" />
                      </div>
                    ))}
                    <div className="col-12 col-md-4 d-flex gap-2">
                      <Skel className="skel-btn" style={{ width: 120 }} />
                      <Skel className="skel-btn" style={{ width: 120 }} />
                    </div>
                  </div>
                </div>
              </section>

              <TableCardSkeleton rows={rows} />
            </>
          )}

          {/* TABLE-only pages (Booked matches, registrations, etc.) */}
          {variant === "table" && <TableCardSkeleton rows={rows} />}

          {/* DETAIL + TABLE (Tournament detail: info card + matches table) */}
          {variant === "detailTable" && (
            <>
              <section className="card shadow-sm mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2 align-items-center">
                    <Skel className="skel-line" style={{ width: 220 }} />
                    <Skel className="skel-chip" style={{ width: 110 }} />
                  </div>
                  <Skel className="skel-btn" style={{ width: 140 }} />
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {repeat(7).map((i) => (
                      <div className="col-12 col-md-6 col-lg-4" key={i}>
                        <Skel
                          className="skel-line mb-2"
                          style={{ width: 90 }}
                        />
                        <Skel className="skel-input" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <TableCardSkeleton rows={rows} />
            </>
          )}

          {/* ACCORDION pages (Organizer home, Referee dashboard) */}
          {variant === "accordion" && (
            <div className="accordion" id="skeletonAccordion">
              {repeat(accordionItems).map((idx) => (
                <div className="accordion-item" key={idx}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${idx === 0 ? "" : "collapsed"}`}
                      type="button"
                    >
                      <div className="w-100">
                        <Skel
                          className="skel-line mb-2"
                          style={{ width: "40%" }}
                        />
                        <div className="d-flex gap-2 flex-wrap">
                          <Skel className="skel-chip" style={{ width: 120 }} />
                          <Skel className="skel-chip" style={{ width: 100 }} />
                          <Skel className="skel-chip" style={{ width: 140 }} />
                        </div>
                      </div>
                    </button>
                  </h2>

                  <div
                    className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Skel className="skel-line" style={{ width: 120 }} />
                        <Skel className="skel-chip" style={{ width: 160 }} />
                      </div>
                      <TableInlineSkeleton rows={4} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FORM pages (Create tournament, Insert result) */}
          {variant === "form" && (
            <section className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <Skel className="skel-line" style={{ width: 170 }} />
                <Skel className="skel-chip" style={{ width: 140 }} />
              </div>

              <div className="card-body">
                {/* generic sections */}
                {repeat(2).map((s) => (
                  <div className="mb-4" key={s}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Skel className="skel-line" style={{ width: 140 }} />
                      <Skel className="skel-line" style={{ width: 90 }} />
                    </div>

                    <div className="row g-3">
                      {repeat(Math.max(3, Math.min(formFields, 8))).map((i) => (
                        <div className="col-12 col-md-6" key={i}>
                          <Skel
                            className="skel-line mb-2"
                            style={{ width: 110 }}
                          />
                          <Skel className="skel-input" />
                        </div>
                      ))}

                      {/* textarea hint for result/description forms */}
                      <div className="col-12">
                        <Skel
                          className="skel-line mb-2"
                          style={{ width: 140 }}
                        />
                        <Skel className="skel-textarea" />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="d-flex justify-content-between">
                  <Skel className="skel-btn" style={{ width: 120 }} />
                  <Skel className="skel-btn" style={{ width: 120 }} />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- helpers --- */

function TableCardSkeleton({ rows }: { rows: number }) {
  return (
    <section className="card shadow-sm">
      <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <Skel className="skel-line" style={{ width: 140 }} />
        <Skel className="skel-chip" style={{ width: 200 }} />
      </div>

      <div className="table-responsive">
        <TableInlineSkeleton rows={rows} />
      </div>
    </section>
  );
}

function TableInlineSkeleton({ rows }: { rows: number }) {
  return (
    <table className="table align-middle mb-0">
      <thead className="table-light">
        <tr>
          {repeat(7).map((i) => (
            <th key={i}>
              <Skel
                className="skel-line"
                style={{ width: `${70 + i * 8}px` }}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {repeat(rows).map((r) => (
          <tr key={r}>
            {repeat(7).map((c) => (
              <td key={c}>
                <Skel
                  className="skel-line"
                  style={{ width: `${90 + ((r + c) % 3) * 60}px` }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
