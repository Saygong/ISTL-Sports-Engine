import React, { useState } from "react";
import { RoutesEnum } from "../../AppRoutes.tsx";
import { Link } from "react-router";

type Props = {
  minimumPasswordLength?: number; // @minimum_password_length
  links?: React.ReactNode; // replacement for render "devise/shared/links"

  // Optional: if you want to render server-provided errors (or your own)
  initialErrors?: string[];

  onSignedUp?: () => void; // optional callback on success
};

function getCsrfToken(): string | null {
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") ?? null
  );
}

type GenderValue = "" | "0" | "1";

const mockData: Props = {
  minimumPasswordLength: 6,
  links: null,
  initialErrors: [],
};

export default function SignUp() {
  const {
    minimumPasswordLength,
    links,
    initialErrors = [],
    onSignedUp,
  } = mockData;
  const [errors, setErrors] = useState<string[]>(initialErrors);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<GenderValue>("");
  const [birthdate, setBirthdate] = useState(""); // yyyy-mm-dd

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // setErrors([]);
    // if (password !== passwordConfirmation) {
    //   setErrors(["Password confirmation doesn't match Password"]);
    //   return;
    // }
    // setIsSubmitting(true);
    // try {
    //   const csrf = getCsrfToken();
    //   // Devise expects params under user[...] by default (resource_name usually :user).
    //   // Adjust keys if your resource_name differs.
    //   const body = new URLSearchParams();
    //   body.append("user[first_name]", firstName);
    //   body.append("user[last_name]", lastName);
    //   if (gender !== "") body.append("user[gender]", gender); // enum index (0/1)
    //   if (birthdate) body.append("user[birthdate]", birthdate);
    //   body.append("user[email]", email);
    //   body.append("user[password]", password);
    //   body.append("user[password_confirmation]", passwordConfirmation);
    //   const res = await fetch(routes.createRegistration, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    //       ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    //     },
    //     credentials: "same-origin",
    //     body: body.toString(),
    //   });
    //   if (res.ok) {
    //     onSignedUp?.();
    //     // Devise usually redirects; simplest parity:
    //     window.location.reload();
    //     return;
    //   }
    //   // If server returns the HTML form with error messages, you can either:
    //   // - show a generic message (below)
    //   // - or parse errors from response (not done here)
    //   const text = await res.text().catch(() => "");
    //   console.error("Sign up failed:", res.status, text);
    //   setErrors(["Could not sign up. Please check the fields and try again."]);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="all-centered full-height">
      <h2 className="mb-4">Sign up</h2>

      <form onSubmit={handleSubmit}>
        <div className="fields">
          {/* Replacement for: render "devise/shared/error_messages" */}
          {errors.length > 0 && (
            <div className="alert alert-danger" role="alert">
              <ul className="mb-0">
                {errors.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="first_name">
              First name
            </label>
            <input
              id="first_name"
              className="form-control"
              autoFocus
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="last_name">
              Last name
            </label>
            <input
              id="last_name"
              className="form-control"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              className="form-select"
              value={gender}
              onChange={(e) => setGender(e.target.value as GenderValue)}
            >
              <option value="">Select gender</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="birthdate">
              Birthdate
            </label>
            <input
              id="birthdate"
              type="date"
              className="form-control"
              autoComplete="bday"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="password">
              Password{" "}
              {minimumPasswordLength ? (
                <em>({minimumPasswordLength} characters minimum)</em>
              ) : null}
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="password_confirmation">
              Password confirmation
            </label>
            <input
              id="password_confirmation"
              type="password"
              className="form-control"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </div>
      </form>

      <div className="links-centered mt-2">
        <div className="links">
          <Link to={RoutesEnum.Login}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
