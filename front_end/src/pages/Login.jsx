import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const user = await login(email, password);
      const next =
        location.state?.from ||
        (user.role === "admin"
          ? "/admin"
          : user.role === "helper"
          ? "/helper"
          : "/dashboard");
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.userMessage || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth page">
      <div className="auth-grid">
        <aside className="auth-aside">
          <span className="eyebrow">Sign in</span>
          <h1 className="auth-title">
            Welcome back. <em>Filter coffee's nearly there.</em>
          </h1>
          <p className="auth-deck">
            Same form for customers, helpers and admins. Your role lives on the
            account, not in the URL.
          </p>

          <div className="auth-aside-foot">
            <span className="eyebrow">Need a starting point?</span>
            <ul className="auth-cta-list">
              <li>
                <Link to="/signup" className="btn-text">→ I'm a customer signing up</Link>
              </li>
              <li>
                <Link to="/signup/helper" className="btn-text">→ I want to work as a helper</Link>
              </li>
            </ul>
          </div>
        </aside>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          <button type="submit" disabled={busy} className="btn btn-arrow auth-submit">
            {busy ? <><span className="spinner" /> Signing in…</> : "Sign in"}
          </button>

          <div className="auth-foot">
            New here? <Link to="/signup">Create a customer account →</Link>
          </div>

          <div className="auth-demo">
            <span className="eyebrow">Demo credentials</span>
            <p className="auth-demo-line">
              <span>admin@workzone.com</span> · <span className="tabular">Admin@123</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
