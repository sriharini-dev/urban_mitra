import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import "./Auth.css";

const INITIAL = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  addressLine: "",
  city: "Chennai",
  pincode: ""
};

export default function SignupUser() {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((s) => ({ ...s, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await client.post("/api/users/signup", form);
      setDone(true);
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(err.userMessage || "Signup failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth page">
      <div className="auth-grid">
        <aside className="auth-aside">
          <span className="eyebrow">Sign up · Customer</span>
          <h1 className="auth-title">
            Set up your home <em>once.</em>
          </h1>
          <p className="auth-deck">
            One verified helper, the same one each visit. Pick a plan after
            signup. No card on file until you book.
          </p>

          <div className="auth-aside-foot">
            <span className="eyebrow">Already have an account?</span>
            <ul className="auth-cta-list">
              <li><Link to="/login" className="btn-text">→ Sign in instead</Link></li>
              <li><Link to="/signup/helper" className="btn-text">→ I'm here to work, not book</Link></li>
            </ul>
          </div>
        </aside>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          {done && <div className="form-success">Account created. Redirecting to sign-in…</div>}

          <div className="field">
            <label>Full name</label>
            <input required value={form.fullName} onChange={update("fullName")} placeholder="Rahul Kumar" />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={update("email")} placeholder="rahul@gmail.com" />
            </div>
            <div className="field">
              <label>Phone (10 digits)</label>
              <input required pattern="\d{10}" value={form.phone} onChange={update("phone")} placeholder="9876543210" />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Password (min. 8)</label>
              <input type="password" required minLength={8} value={form.password} onChange={update("password")} />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input type="password" required minLength={8} value={form.confirmPassword} onChange={update("confirmPassword")} />
            </div>
          </div>

          <div className="auth-section">
            <h3 className="auth-section-h">
              Where should the <em>mitra</em> show up?
            </h3>

            <div className="field">
              <label>Address line</label>
              <input required value={form.addressLine} onChange={update("addressLine")} placeholder="Adyar, 1st Cross Street" />
            </div>

            <div className="field-row">
              <div className="field">
                <label>City</label>
                <input required value={form.city} onChange={update("city")} />
              </div>
              <div className="field">
                <label>Pincode (6 digits)</label>
                <input required pattern="\d{6}" value={form.pincode} onChange={update("pincode")} placeholder="600020" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={busy} className="btn btn-arrow auth-submit">
            {busy ? <><span className="spinner" /> Creating account…</> : "Create account"}
          </button>

          <div className="auth-foot">
            By creating an account you agree to keep things simple.
          </div>
        </form>
      </div>
    </div>
  );
}
