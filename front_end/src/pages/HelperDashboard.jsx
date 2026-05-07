import { useEffect, useState } from "react";
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

export default function HelperDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/api/bookings/my")
      .then(({ data }) => setBookings(data.data || []))
      .catch((e) => setError(e.userMessage))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash page">
      <header className="dash-head">
        <span className="eyebrow">Helper dashboard</span>
        <h1 className="dash-title">
          வணக்கம், <em>{user?.fullName?.split(" ")[0]}.</em>
        </h1>
        <span className="badge badge-dot badge-ok">Verified · {user?.status}</span>
      </header>

      {error && <div className="form-error">{error}</div>}

      {user?.status === "pending" ? (
        <div className="dash-empty">
          <div className="dash-empty-mark">⏳</div>
          <h3>Application under review</h3>
          <p>Once an admin approves your account, your assigned bookings will appear here. We usually get back within 1–2 working days.</p>
        </div>
      ) : loading ? (
        <div className="dash-loading"><span className="spinner" /> Loading your bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-mark">∅</div>
          <h3>No bookings assigned yet</h3>
          <p>An admin will assign you to a customer's booking soon. You'll be notified.</p>
        </div>
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
