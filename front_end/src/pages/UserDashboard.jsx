import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./Dashboard.css";

const STATUS_TONE = {
  pending:   "badge-warn",
  confirmed: "badge-ink",
  assigned:  "badge-ok",
  completed: "badge-mute",
  cancelled: "badge-stop"
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short"
  });
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.get("/api/bookings/my")
      .then(({ data }) => setBookings(data.data || []))
      .catch((e) => setError(e.userMessage))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash page">
      <header className="dash-head">
        <span className="eyebrow">Customer dashboard</span>
        <h1 className="dash-title">
          {bookings.length > 0
            ? <>Your <em>nanban</em> roster.</>
            : <>வணக்கம், <em>{user?.fullName?.split(" ")[0]}.</em></>}
        </h1>
        <Link to="/book" className="btn btn-arrow dash-cta">New booking</Link>
      </header>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <div className="dash-loading"><span className="spinner" /> Loading your bookings…</div>
      ) : bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="dash-table">
          <div className="dash-table-head">
            <span>#</span>
            <span>Plan</span>
            <span>Date</span>
            <span>Slot</span>
            <span>Where</span>
            <span>Status</span>
          </div>
          {bookings.map((b, i) => (
            <article key={b.id} className="dash-row">
              <span className="dash-row-idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="dash-row-plan">
                <strong>{b.planName?.replace(" Plan", "")}</strong>
                <small className="tabular">#{b.id}</small>
              </span>
              <span className="dash-row-date tabular">{formatDate(b.serviceDate)}</span>
              <span className="dash-row-slot">{b.timeSlot}</span>
              <span className="dash-row-addr">
                {b.addressLine}<br />
                <small className="tabular">{b.city} · {b.pincode}</small>
              </span>
              <span>
                <span className={`badge badge-dot ${STATUS_TONE[b.status]}`}>{b.status}</span>
              </span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="dash-empty">
      <div className="dash-empty-mark">∅</div>
      <h3>No bookings yet.</h3>
      <p>Pick a plan, then place your first booking. Takes about a minute.</p>
      <Link to="/plans" className="btn btn-arrow">Browse plans</Link>
    </div>
  );
}
