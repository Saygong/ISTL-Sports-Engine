import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { RoutesEnum } from "../../AppRoutes";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  //const { rememberable, links } = mockData;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      // Navigate to appropriate dashboard based on user role
      switch (user?.__typename) {
        case "Player":
          navigate(RoutesEnum.PlayerHomePage, { replace: true });
          break;
        case "Organizer":
          navigate(RoutesEnum.OrganizerHomePage, { replace: true });
          break;
        case "Referee":
          navigate(RoutesEnum.RefereeHomePage, { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    }
  };

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
            {/* <Link to={RoutesEnum.ForgotPassword}>Forgot your password?</Link> */}
          </div>
        </div>
      </div>
  );
}
