import { useEffect, useState } from "react";
import client from "../api/client";
import "./Dashboard.css";

const STATUS_TONE = {
  pending:   "badge-warn",
  confirmed: "badge-ink",
  assigned:  "badge-ok",
  completed: "badge-mute",
  cancelled: "badge-stop",
  active:    "badge-ok",
  blocked:   "badge-stop"
};

const BOOKING_STATUSES = ["pending", "confirmed", "assigned", "completed", "cancelled"];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short"
  });
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [helpers, setHelpers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [ov, hp, bk] = await Promise.all([
        client.get("/api/admin/overview"),
        client.get("/api/admin/helpers"),
        client.get("/api/bookings/my")
      ]);
      setOverview(ov.data.data);
      setHelpers(hp.data.data || []);
      setBookings(bk.data.data || []);
    } catch (e) {
      setError(e.userMessage);
    } finally {
      setLoading(false);
    }
  }

  async function updateHelperStatus(id, status) {
    try {
      await client.patch(`/api/admin/helpers/${id}/status`, { status });
      await fetchAll();
    } catch (e) {
      setError(e.userMessage);
    }
  }

  async function updateBookingStatus(id, status) {
    try {
      await client.patch(`/api/bookings/${id}/status`, { status });
      await fetchAll();
    } catch (e) {
      setError(e.userMessage);
    }
  }

  return (
    <div className="dash page">
      <header className="dash-head">
        <span className="eyebrow">Admin · operations</span>
        <h1 className="dash-title">
          The <em>command line</em> of Urban Mitra.
        </h1>
      </header>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="dash-loading"><span className="spinner" /> Loading dashboard…</div>}

      {overview && (
        <section className="admin-grid">
          <div className="admin-card">
            <span className="admin-card-h">People</span>
            <dl className="admin-card-stack">
              <div className="admin-card-line">
                <dt>Customers</dt>
                <dd className="tabular">{overview.users.totalUsers}</dd>
              </div>
              <div className="admin-card-line">
                <dt>Helpers</dt>
                <dd className="tabular">{overview.users.totalHelpers}</dd>
              </div>
              <div className="admin-card-line">
                <dt>Pending review</dt>
                <dd className="tabular" style={{ color: "var(--terracotta)" }}>
                  {overview.users.pendingHelpers}
                </dd>
              </div>
            </dl>
          </div>

          <div className="admin-card">
            <span className="admin-card-h">Plans</span>
            <dl className="admin-card-stack">
              <div className="admin-card-line">
                <dt>Total</dt>
                <dd className="tabular">{overview.plans.totalPlans}</dd>
              </div>
              <div className="admin-card-line">
                <dt>Active</dt>
                <dd className="tabular">{overview.plans.activePlans}</dd>
              </div>
            </dl>
          </div>

          <div className="admin-card">
            <span className="admin-card-h">Bookings</span>
            <dl className="admin-card-stack">
              <div className="admin-card-line">
                <dt>Total</dt>
                <dd className="tabular">{overview.bookings.totalBookings}</dd>
              </div>
              <div className="admin-card-line">
                <dt>Pending</dt>
                <dd className="tabular" style={{ color: "var(--saffron)" }}>
                  {overview.bookings.pendingBookings}
                </dd>
              </div>
              <div className="admin-card-line">
                <dt>Completed</dt>
                <dd className="tabular">{overview.bookings.completedBookings}</dd>
              </div>
            </dl>
          </div>
        </section>
      )}

      {/* HELPERS ===================================================== */}
      <section className="dash-section">
        <div className="dash-section-head">
          <h2 className="dash-section-h">Helper <em>roster</em></h2>
          <span className="eyebrow">{helpers.length} total</span>
        </div>

        {helpers.length === 0 ? (
          <p style={{ color: "var(--ink-mute)" }}>No helpers signed up yet.</p>
        ) : (
          helpers.map((h) => (
            <article key={h.id} className="helper-row">
              <span className="dash-row-idx tabular">#{h.id}</span>
              <span>
                <strong>{h.fullName}</strong>
                <small>{h.email}</small>
              </span>
              <span className="tabular">{h.phone}</span>
              <span className="helper-skills">
                {(h.skills || []).map((s) => (
                  <span key={s} className="helper-skill-tag">{s}</span>
                ))}
              </span>
              <span>
                <span className={`badge badge-dot ${STATUS_TONE[h.status]}`}>{h.status}</span>
              </span>
              <span className="helper-actions">
                {h.status !== "active" && (
                  <button onClick={() => updateHelperStatus(h.id, "active")} className="btn btn-sm btn-accent">
                    Approve
                  </button>
                )}
                {h.status !== "blocked" && (
                  <button onClick={() => updateHelperStatus(h.id, "blocked")} className="btn btn-sm btn-ghost">
                    Block
                  </button>
                )}
                {h.status !== "pending" && (
                  <button onClick={() => updateHelperStatus(h.id, "pending")} className="btn btn-sm btn-ghost">
                    Hold
                  </button>
                )}
              </span>
            </article>
          ))
        )}
      </section>

      {/* BOOKINGS ==================================================== */}
      <section className="dash-section">
        <div className="dash-section-head">
          <h2 className="dash-section-h">All <em>bookings</em></h2>
          <span className="eyebrow">{bookings.length} total</span>
        </div>

        {bookings.length === 0 ? (
          <p style={{ color: "var(--ink-mute)" }}>No bookings yet.</p>
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
                  <small className="tabular">user #{b.userId} · #{b.id}</small>
                </span>
                <span className="dash-row-date tabular">{formatDate(b.serviceDate)}</span>
                <span className="dash-row-slot">{b.timeSlot}</span>
                <span className="dash-row-addr">
                  {b.addressLine}<br />
                  <small className="tabular">{b.city} · {b.pincode}</small>
                </span>
                <span>
                  <select
                    className="dash-status-select"
                    value={b.status}
                    onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                  >
                    {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
