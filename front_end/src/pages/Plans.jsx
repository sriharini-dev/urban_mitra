import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./Plans.css";

const FEATURE_LABELS = {
  cleaning: "Cleaning",
  cooking: "Cooking",
  laundry: "Laundry",
  pet_walking: "Pet walks",
  grocery_runs: "Grocery runs"
};

const PLAN_BLURB = {
  "Starter Plan":  "For small flats. Light help, regular hours.",
  "Standard Plan": "The most-chosen plan for working couples.",
  "Premium Plan":  "Full-service. We handle everything but the fun parts."
};

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthed, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    client.get("/api/plans")
      .then(({ data }) => {
        if (!alive) return;
        setPlans(data.data || []);
      })
      .catch((e) => alive && setError(e.userMessage))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  function handleChoose(plan) {
    if (!isAuthed || role !== "user") {
      navigate("/login", { state: { from: "/book", planId: plan.id } });
      return;
    }
    navigate("/book", { state: { planId: plan.id } });
  }

  return (
    <div className="plans page">
      <div className="plans-head">
        <span className="eyebrow">02 — Plans &amp; pricing</span>
        <h1 className="plans-title">
          Three subscriptions. <em>Pick the one that matches your week.</em>
        </h1>
        <p className="plans-deck">
          Every plan includes the same one verified helper assigned to your home.
          The only difference is how often they show up. Cancel before day 30.
        </p>
      </div>

      {error && <div className="form-error">{error}</div>}
      {loading && (
        <div className="plans-loading">
          <span className="spinner" /> <span>Loading plans…</span>
        </div>
      )}

      <div className="plans-grid">
        {plans.map((plan, idx) => {
          const popular = plan.name === "Standard Plan";
          return (
            <article
              key={plan.id}
              className={`plan-card rise rise-${idx + 1} ${popular ? "plan-card-pop" : ""}`}
            >
              <header className="plan-head">
                <span className="plan-idx">{String(idx + 1).padStart(2, "0")}</span>
                {popular && <span className="badge badge-stop badge-dot">Most chosen</span>}
              </header>

              <h2 className="plan-name">{plan.name.replace(" Plan", "")}</h2>
              <p className="plan-blurb">{PLAN_BLURB[plan.name] || plan.description}</p>

              <div className="plan-price">
                <span className="plan-price-num tabular">
                  ₹{Number(plan.price).toLocaleString("en-IN")}
                </span>
                <span className="plan-price-suffix">
                  per <br /> month
                </span>
              </div>

              <hr className="hairline" />

              <dl className="plan-meta">
                <div>
                  <dt>Visits</dt>
                  <dd className="tabular">{plan.visitsPerMonth} / mo</dd>
                </div>
                <div>
                  <dt>Validity</dt>
                  <dd className="tabular">{plan.durationDays} days</dd>
                </div>
              </dl>

              <hr className="hairline-soft" />

              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className="plan-tick">✓</span>
                    <span>{FEATURE_LABELS[f] || f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleChoose(plan)}
                className={`btn ${popular ? "btn-accent" : "btn-ghost"} btn-arrow plan-cta`}
              >
                Choose {plan.name.replace(" Plan", "")}
              </button>
            </article>
          );
        })}
      </div>

      <aside className="plans-foot">
        <p>
          Not sure yet? <Link to="/signup">Create an account</Link>, browse a few
          weeks of bookings, then commit. Or read about{" "}
          <Link to="/signup/helper">how we vet helpers</Link>.
        </p>
      </aside>
    </div>
  );
}
