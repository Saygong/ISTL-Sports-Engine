import React, { useState } from "react";
import { RoutesEnum } from "../../AppRoutes";
import { Link } from "react-router";

type Props = {
  resetPasswordToken: string; // resource.reset_password_token
  minimumPasswordLength?: number; // @minimum_password_length

  links?: React.ReactNode; // replacement for render "devise/shared/links"
  initialErrors?: string[]; // optional server-side errors
  onChanged?: () => void; // optional callback on success
};

/*function getCsrfToken(): string | null {
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") ?? null
  );
}*/

const mockData: Props = {
  resetPasswordToken: "",
  minimumPasswordLength: 6,
  links: null,
  initialErrors: [],
};

export default function ChangePassword() {
  const {
    //resetPasswordToken,
    minimumPasswordLength,
    //links,
    initialErrors = [],
    //onChanged,
  } = mockData;
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors] = useState<string[]>(initialErrors);
  const [isSubmitting] = useState(false);
  const [success] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setErrors([]);
    // if (password !== passwordConfirmation) {
    //   setErrors(["Password confirmation doesn't match Password"]);
    //   return;
    // }
    // setIsSubmitting(true);
    // try {
    //   const csrf = getCsrfToken();
    //   // Devise expects params under user[...] by default
    //   const body = new URLSearchParams();
    //   body.append("user[reset_password_token]", resetPasswordToken);
    //   body.append("user[password]", password);
    //   body.append("user[password_confirmation]", passwordConfirmation);
    //   const res = await fetch(routes.updatePassword, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    //       ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    //     },
    //     credentials: "same-origin",
    //     body: body.toString(),
    //   });
    //   if (res.ok) {
    //     setSuccess(true);
    //     onChanged?.();
    //     return;
    //   }
    //   const text = await res.text().catch(() => "");
    //   console.error("Password change failed:", res.status, text);
    //   setErrors(["Could not change password. Please try again."]);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="all-centered full-height">
      <h2 className="mb-4">Change your password</h2>

      <form onSubmit={handleSubmit}>
        <div className="fields">
          {/* Replacement for: render "devise/shared/error_messages" */}
          {errors.length > 0 && (
            <div className="alert alert-danger" role="alert">
              <ul className="mb-0">
                {errors.map((msg: string, i: number) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              Your password has been changed successfully.
            </div>
          )}

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="password">
              New password{" "}
              {minimumPasswordLength ? (
                <>
                  <em>({minimumPasswordLength} characters minimum)</em>
                  <br />
                </>
              ) : null}
            </label>

            <input
              id="password"
              type="password"
              className="form-control"
              autoFocus
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <br />

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="password_confirmation">
              Confirm new password
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
            {isSubmitting ? "Changing..." : "Change my password"}
          </button>
        </div>
      </form>

      <div className="links-centered mt-2">
        <div className="links">
          <Link to={RoutesEnum.Login}>Log in</Link>
          <Link to={RoutesEnum.SignUp}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
