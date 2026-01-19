import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { RoutesEnum } from "../../AppRoutes.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";

type Props = {
  //   // Devise session_path(resource_name)
  //   routes: {
  //     createSession: string; // POST
  //   };

  rememberable?: boolean; // devise_mapping.rememberable?
  links?: React.ReactNode; // replacement for render "devise/shared/links"
  onLoggedIn?: () => void; // optional callback on success
};

function getCsrfToken(): string | null {
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") ?? null
  );
}

const mockData: Props = {
  rememberable: false,
  links: null,
};

export default function Login() {
  //const { rememberable, links } = mockData;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await login(email, password);

    if (res.success) {
      navigate("/", {
        replace: true,
      });
    }

    // e.preventDefault();
    // setIsSubmitting(true);
    // try {
    //   const csrf = getCsrfToken();
    //   // Devise expects params under user[...] by default (resource_name usually :user)
    //   // If your resource_name differs, adjust the keys.
    //   const body = new URLSearchParams();
    //   body.append("user[email]", email);
    //   body.append("user[password]", password);
    //   if (rememberable) body.append("user[remember_me]", rememberMe ? "1" : "0");
    //   const res = await fetch(routes.createSession, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    //       ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    //     },
    //     credentials: "same-origin",
    //     body: body.toString(),
    //   });
    //   if (res.ok) {
    //     onLoggedIn?.();
    //     // With Devise, the server often responds with a redirect; simplest parity:
    //     window.location.reload();
    //     return;
    //   }
    //   const text = await res.text().catch(() => "");
    //   console.error("Login failed:", res.status, text);
    //   alert("Invalid email or password.");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  //    const showLogin = controllerName !== "sessions";
  //   const showSignUp = !!devise.registerable && controllerName !== "registrations";
  //   const showForgot =
  //     !!devise.recoverable && controllerName !== "passwords" && controllerName !== "registrations";
  //   const showConfirmation = !!devise.confirmable && controllerName !== "confirmations";
  //   const showUnlock =
  //     !!devise.lockable && unlockStrategyEmailEnabled && controllerName !== "unlocks";

  //   const showOmniauth = !!devise.omniauthable && omniauthProviders.length > 0;

  return (
    <div className="all-centered full-height">
      <h2 className="mb-4">Log in</h2>

      <form onSubmit={handleSubmit}>
        <div className="fields">
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

          <div className="field text-center field-lg">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* {rememberable && (
            <div className="text-center">
              <input
                id="remember_me"
                type="checkbox"
                className="form-check-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label ms-2" htmlFor="remember_me">
                Remember me
              </label>
            </div>
          )} */}

          <div className="actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </div>
        </div>
      </form>

      <div className="links-centered mt-2">
        <div className="links">
          <Link to={RoutesEnum.SignUp}>Sign up</Link>
          <Link to={RoutesEnum.ForgotPassword}>Forgot your password?</Link>
        </div>
      </div>
    </div>
  );
}
