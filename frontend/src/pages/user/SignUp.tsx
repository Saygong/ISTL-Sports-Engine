import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { RoutesEnum } from "../../AppRoutes";
import { GenderEnum, useSignUpMutation } from "../../generated/graphql";

type GenderValue = GenderEnum;

export default function SignUp() {
  const minimumPasswordLength = 6;
  const [errors, setErrors] = useState<string[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<GenderValue | undefined>();
  const [birthdate, setBirthdate] = useState(""); // yyyy-mm-dd

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [, signUpMutation] = useSignUpMutation();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // e.preventDefault();
    setErrors([]);
    if (password !== passwordConfirmation) {
      setErrors(["Password confirmation doesn't match Password"]);
      return;
    }
    if (!gender) {
      setErrors(["Gender is missing"]);
      return;
    }
    setIsSubmitting(true);

    const res = await signUpMutation({
      args: {
        auth: {
          email,
          password,
          passwordConfirmation,
        },
        user: {
          firstName,
          lastName,
          birthdate,
          gender,
        },
      },
    });

    setIsSubmitting(false);
    if (res.data?.signUp) {
      navigate(RoutesEnum.Login);
    }
  };

  return (
    <div className="all-centered full-height">
      <h2 className="mb-4">Sign up</h2>

      <div>
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
              <option value={GenderEnum.Male}>Male</option>
              <option value={GenderEnum.Female}>Female</option>
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
            className="btn btn-primary"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </div>
      </div>

      <div className="links-centered mt-2">
        <div className="links">
          <Link to={RoutesEnum.Login}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
