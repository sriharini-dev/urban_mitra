import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import "./Auth.css";

const SKILL_OPTIONS = [
  { id: "cleaning",     label: "Cleaning" },
  { id: "cooking",      label: "Cooking" },
  { id: "laundry",      label: "Laundry" },
  { id: "pet_walking",  label: "Pet walks" },
  { id: "grocery_runs", label: "Grocery" }
];

const INITIAL = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  addressLine: "",
  city: "Chennai",
  pincode: "",
  gender: "",
  dateOfBirth: "",
  skills: [],
  experienceYears: 1,
  availability: "morning",
  idProofType: "Aadhaar",
  idProofNumber: "",
  about: ""
};

export default function SignupHelper() {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((s) => ({ ...s, [field]: e.target.value }));
  }

  function toggleSkill(id) {
    setForm((s) =>
      s.skills.includes(id)
        ? { ...s, skills: s.skills.filter((x) => x !== id) }
        : { ...s, skills: [...s.skills, id] }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (form.skills.length === 0) {
      setError("Pick at least one skill.");
      return;
    }
    setBusy(true);
    try {
      await client.post("/api/helpers/signup", {
        ...form,
        experienceYears: Number(form.experienceYears)
      });
      setDone(true);
      setTimeout(() => navigate("/login"), 1800);
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
          <span className="eyebrow">Sign up · Helper</span>
          <h1 className="auth-title">
            Apply <em>once.</em> Stay vouched-for forever.
          </h1>
          <p className="auth-deck">
            We verify documents, references and a short interview. Approved
            helpers get a steady roster of homes — no scrolling for jobs.
          </p>
          <div className="auth-aside-foot">
            <span className="eyebrow">After you submit</span>
            <p className="auth-deck">
              Your account stays in <em>pending</em> until an admin approves it.
              Once active, sign in to see your assigned bookings.
            </p>
            <ul className="auth-cta-list">
              <li><Link to="/login" className="btn-text">→ I already applied, sign me in</Link></li>
              <li><Link to="/signup" className="btn-text">→ Actually I'm a customer</Link></li>
            </ul>
          </div>
        </aside>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          {done && <div className="form-success">Application received. Redirecting…</div>}

          <h3 className="auth-section-h" style={{ marginTop: 0 }}>
            About <em>you</em>
          </h3>

          <div className="field">
            <label>Full name</label>
            <input required value={form.fullName} onChange={update("fullName")} placeholder="Sita Devi" />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={update("email")} />
            </div>
            <div className="field">
              <label>Phone (10 digits)</label>
              <input required pattern="\d{10}" value={form.phone} onChange={update("phone")} placeholder="9123456780" />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Password</label>
              <input type="password" required minLength={8} value={form.password} onChange={update("password")} />
            </div>
            <div className="field">
              <label>Confirm</label>
              <input type="password" required minLength={8} value={form.confirmPassword} onChange={update("confirmPassword")} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Gender</label>
              <select required value={form.gender} onChange={update("gender")}>
                <option value="">Select…</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="field">
              <label>Date of birth</label>
              <input type="date" required value={form.dateOfBirth} onChange={update("dateOfBirth")} />
            </div>
          </div>

          <div className="auth-section">
            <h3 className="auth-section-h">Where you live &amp; serve</h3>
            <div className="field">
              <label>Address</label>
              <input required value={form.addressLine} onChange={update("addressLine")} placeholder="T. Nagar, 5th Avenue" />
            </div>
            <div className="field-row">
              <div className="field">
                <label>City</label>
                <input required value={form.city} onChange={update("city")} />
              </div>
              <div className="field">
                <label>Pincode</label>
                <input required pattern="\d{6}" value={form.pincode} onChange={update("pincode")} placeholder="600017" />
              </div>
            </div>
          </div>

          <div className="auth-section">
            <h3 className="auth-section-h">What you <em>do</em></h3>
            <div className="field">
              <label>Skills (pick all that apply)</label>
              <div className="chips">
                {SKILL_OPTIONS.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleSkill(s.id)}
                    className={`chip ${form.skills.includes(s.id) ? "chip-on" : ""}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Years of experience</label>
                <input type="number" min={0} required value={form.experienceYears} onChange={update("experienceYears")} />
              </div>
              <div className="field">
                <label>Availability</label>
                <select value={form.availability} onChange={update("availability")}>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="full_day">Full day</option>
                </select>
              </div>
            </div>
          </div>

          <div className="auth-section">
            <h3 className="auth-section-h">Identity verification</h3>
            <div className="field-row">
              <div className="field">
                <label>ID type</label>
                <select value={form.idProofType} onChange={update("idProofType")}>
                  <option>Aadhaar</option>
                  <option>PAN</option>
                  <option>Voter ID</option>
                  <option>Driving Licence</option>
                </select>
              </div>
              <div className="field">
                <label>ID number</label>
                <input required value={form.idProofNumber} onChange={update("idProofNumber")} placeholder="XXXX-XXXX-1234" />
              </div>
            </div>

            <div className="field">
              <label>A little about you (optional)</label>
              <textarea value={form.about} onChange={update("about")} placeholder="Five years cooking for a family of four, fluent in Tamil and English…" />
            </div>
          </div>

          <button type="submit" disabled={busy} className="btn btn-accent btn-arrow auth-submit">
            {busy ? <><span className="spinner" /> Submitting…</> : "Submit application"}
          </button>

          <div className="auth-foot">
            Approval typically takes <em>1–2 working days</em>. We'll call your phone before activating.
          </div>
        </form>
      </div>
    </div>
  );
}
