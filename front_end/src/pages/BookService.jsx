import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./Auth.css";
import "./BookService.css";

const TIME_SLOTS = [
  "07:00 AM - 09:00 AM",
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM"
];

export default function BookService() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [planId, setPlanId] = useState(location.state?.planId || null);
  const [serviceDate, setServiceDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Chennai");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    client.get("/api/plans")
      .then(({ data }) => {
        setPlans(data.data || []);
        if (!planId && data.data?.length) setPlanId(data.data[0].id);
      })
      .catch((e) => setError(e.userMessage));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await client.post("/api/bookings", {
        planId: Number(planId),
        serviceDate,
        timeSlot,
        notes,
        addressLine,
        city,
        pincode
      });
      setDone(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.userMessage || "Booking failed.");
    } finally {
      setBusy(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const selectedPlan = plans.find((p) => p.id === Number(planId));

  return (
    <div className="book page">
      <header className="book-head">
        <span className="eyebrow">New booking</span>
        <h1 className="book-title">
          Book your <em>nanban</em>.
        </h1>
        <p className="book-deck">
          Hi <strong>{user?.fullName?.split(" ")[0]}</strong> — pick a plan,
          a date, a slot. We'll confirm and assign someone within a few hours.
        </p>
      </header>

      <form className="book-form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        {done && <div className="form-success">Booking placed. Redirecting to your dashboard…</div>}

        <section className="book-section">
          <span className="eyebrow">01 — Plan</span>
          <div className="book-plans">
            {plans.map((p) => (
              <label key={p.id} className={`book-plan ${Number(planId) === p.id ? "book-plan-on" : ""}`}>
                <input
                  type="radio"
                  name="plan"
                  value={p.id}
                  checked={Number(planId) === p.id}
                  onChange={(e) => setPlanId(Number(e.target.value))}
                />
                <span className="book-plan-name">{p.name.replace(" Plan", "")}</span>
                <span className="book-plan-price tabular">₹{Number(p.price).toLocaleString("en-IN")}<em>/mo</em></span>
                <span className="book-plan-meta tabular">{p.visitsPerMonth} visits</span>
              </label>
            ))}
          </div>
        </section>

        <section className="book-section">
          <span className="eyebrow">02 — When</span>
          <div className="field-row">
            <div className="field">
              <label>Service date</label>
              <input
                type="date"
                required
                min={today}
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Time slot</label>
              <select required value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                <option value="">Select a slot…</option>
                {TIME_SLOTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="book-section">
          <span className="eyebrow">03 — Where</span>
          <div className="field">
            <label>Address line</label>
            <input required value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Adyar, 1st Cross Street" />
          </div>
          <div className="field-row">
            <div className="field">
              <label>City</label>
              <input required value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="field">
              <label>Pincode</label>
              <input required pattern="\d{6}" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="600020" />
            </div>
          </div>
        </section>

        <section className="book-section">
          <span className="eyebrow">04 — A note (optional)</span>
          <div className="field">
            <label>Anything we should know?</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Mop in the balcony cupboard. Don't ring twice — uncle is napping." />
          </div>
        </section>

        <div className="book-summary">
          {selectedPlan && (
            <div className="book-summary-card">
              <span className="eyebrow">Order summary</span>
              <div className="book-summary-row">
                <span>{selectedPlan.name}</span>
                <span className="tabular">₹{Number(selectedPlan.price).toLocaleString("en-IN")}<em>/mo</em></span>
              </div>
              <div className="book-summary-row book-summary-row-mute">
                <span>Includes</span>
                <span>{selectedPlan.visitsPerMonth} visits over {selectedPlan.durationDays} days</span>
              </div>
            </div>
          )}
          <button type="submit" disabled={busy} className="btn btn-accent btn-arrow">
            {busy ? <><span className="spinner" /> Booking…</> : "Confirm booking"}
          </button>
        </div>

        <p className="book-foot">
          You'll only be charged once we confirm a helper.
          <Link to="/plans" className="btn-text" style={{ marginLeft: 8 }}>← back to plans</Link>
        </p>
      </form>
    </div>
  );
}
