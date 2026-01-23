import React, { useState } from "react";
import { RoutesEnum } from "../../AppRoutes";
import { Link } from "react-router";

type Props = {
  links?: React.ReactNode; // replacement for render "devise/shared/links"
  initialErrors?: string[]; // optional server-provided errors
  onSent?: () => void; // optional callback on success
};

function getCsrfToken(): string | null {
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") ?? null
  );
}

const mockData: Props = {
  links: null,
  initialErrors: [],
};

export default function ForgotPassword() {
  const { links, initialErrors = [], onSent } = mockData;
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string[]>(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // setErrors([]);
    // setIsSubmitting(true);
    // try {
    //   const csrf = getCsrfToken();
    //   // Devise expects params under user[email] by default (resource_name usually :user)
    //   // Adjust if your resource_name differs.
    //   const body = new URLSearchParams();
    //   body.append("user[email]", email);
    //   const res = await fetch(routes.createPasswordReset, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    //       ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    //     },
    //     credentials: "same-origin",
    //     body: body.toString(),
    //   });
    //   if (res.ok) {
    //     setSent(true);
    //     onSent?.();
    //     return;
    //   }
    //   const text = await res.text().catch(() => "");
    //   console.error("Password reset request failed:", res.status, text);
    //   setErrors(["Could not send reset instructions. Please check the email and try again."]);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="all-centered full-height">
      <h2 className="mb-4">Forgot your password?</h2>

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

          {sent && (
            <div className="alert alert-success" role="alert">
              If the email exists, you’ll receive reset password instructions
              shortly.
            </div>
          )}

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {isSubmitting
              ? "Sending..."
              : "Send me reset password instructions"}
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
