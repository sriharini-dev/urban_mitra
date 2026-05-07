import { Link } from "react-router-dom";
import "./Home.css";

const SERVICES = [
  { idx: "01", title: "Cleaning",    line: "Mopped, dusted, dustbins out — like clockwork." },
  { idx: "02", title: "Cooking",     line: "Daily meals — sambar, rasam, tiffin — at your spice level." },
  { idx: "03", title: "Laundry",     line: "Sorted, washed, ironed, folded — never confused." },
  { idx: "04", title: "Pet walks",   line: "Mornings or evenings. Indie, retriever, all loved." },
  { idx: "05", title: "Grocery",     line: "Koyambedu runs and that one specific Aachi brand of dal." }
];

const STEPS = [
  { n: "I",   t: "Pick a plan",      d: "Three subscriptions, no hidden riders. Cancel anytime within 30 days." },
  { n: "II",  t: "Meet your nanban",  d: "We assign one background-verified helper, not a rotation of strangers." },
  { n: "III", t: "Live a calmer week", d: "Track tasks, message your helper, pay online. That's it." }
];

export default function Home() {
  return (
    <div className="home">
      {/* HERO ============================================================ */}
      <section className="hero page">
        <div className="hero-mark rise">
          <span className="hero-tamil-tag">வணக்கம்.</span>
          <span className="eyebrow">01 — A subscription, not a juggling act</span>
        </div>

        <h1 className="hero-title">
          <span className="hero-line rise rise-1">One reliable</span>
          <span className="hero-line hero-line-italic rise rise-2">person.</span>
          <span className="hero-line hero-line-3 rise rise-3">
            <span className="hero-not">Not</span>
            <span className="hero-strike">five apps.</span>
          </span>
        </h1>

        <div className="hero-grid">
          <p className="hero-deck rise rise-5">
            Urban Mitra is one trusted, background-verified helper for everything a busy
            home asks for — cleaning, cooking, laundry, pet walks, grocery runs. Under
            one monthly plan. Managed inside one calm app.
          </p>

          <div className="hero-actions rise rise-5">
            <Link to="/plans" className="btn btn-arrow">See the plans</Link>
            <Link to="/signup/helper" className="btn btn-ghost btn-arrow">Work with us</Link>
          </div>
        </div>

        <aside className="hero-stamp rise rise-5" aria-hidden="true">
          <svg viewBox="0 0 200 200" width="170" height="170">
            <defs>
              <path id="stamp-arc" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
            </defs>
            <circle cx="100" cy="100" r="92" fill="none" stroke="#1A1612" strokeWidth="1" />
            <circle cx="100" cy="100" r="86" fill="none" stroke="#1A1612" strokeWidth="0.5" strokeDasharray="2 4" />
            <text fill="#1A1612" fontSize="11" fontFamily="Instrument Sans" letterSpacing="3">
              <textPath href="#stamp-arc" startOffset="0">
                VERIFIED · VETTED · VOUCHED FOR · VERIFIED · VETTED · VOUCHED FOR ·
              </textPath>
            </text>
            <text x="100" y="92" textAnchor="middle" fontFamily="Fraunces" fontStyle="italic" fontSize="34" fontWeight="600" fill="#C8533A">um</text>
            <text x="100" y="118" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="2" fill="#1A1612">EST. 2026</text>
          </svg>
        </aside>

        <div className="hero-meta">
          <span className="hero-meta-line">Chennai · Coimbatore · Madurai · soon Bengaluru</span>
          <span className="hero-meta-mono">↓ scroll for the story</span>
        </div>
      </section>

      <hr className="hairline" />

      {/* HOW IT WORKS ==================================================== */}
      <section className="how page">
        <div className="how-head">
          <span className="eyebrow">02 — How it works</span>
          <h2 className="how-title">
            Three steps. <em>That's the entire onboarding.</em>
          </h2>
        </div>

        <ol className="how-steps">
          {STEPS.map(({ n, t, d }) => (
            <li key={n} className="how-step">
              <span className="how-step-n">{n}</span>
              <h3 className="how-step-t">{t}</h3>
              <p className="how-step-d">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* SERVICES ======================================================== */}
      <section className="services page">
        <div className="services-head">
          <span className="eyebrow">03 — Inside the subscription</span>
          <h2 className="services-title">
            Five chores, <em>one</em> person.
          </h2>
        </div>

        <ul className="services-list">
          {SERVICES.map(({ idx, title, line }) => (
            <li key={idx} className="services-item">
              <span className="services-idx">{idx}</span>
              <span className="services-title-row">{title}</span>
              <span className="services-line">{line}</span>
              <span className="services-rule" />
            </li>
          ))}
        </ul>
      </section>

      {/* QUOTE =========================================================== */}
      <section className="quote page-narrow">
        <span className="eyebrow">04 — A note from the founders</span>
        <blockquote className="quote-body">
          <span className="quote-mark">&ldquo;</span>
          We grew up in homes where one person knew every <em>almirah</em>,
          every <em>oorga jaadi</em>, every quirk of the mixie. The city pulled
          us apart from that. <em>Nanban</em> is the small thing that brings it
          back — one person who knows your home, not five strangers who don't.
        </blockquote>
        <div className="quote-attr">
          <span>— S. &amp; Y., founders</span>
          <span className="quote-attr-mono">சென்னை · Chennai, May 2026</span>
        </div>
      </section>

      {/* PRICING TEASE =================================================== */}
      <section className="tease page">
        <div className="tease-grid">
          <div>
            <span className="eyebrow">05 — Plans</span>
            <h2 className="tease-title">
              From <span className="tease-num">₹1,999</span> a month.
            </h2>
            <p className="tease-deck">
              Three plans. Starter, Standard, Premium. Pause or cancel any time
              before day 30 — keep what you've used, no questions, no recovery
              calls.
            </p>
            <Link to="/plans" className="btn btn-arrow">Compare the three</Link>
          </div>
          <div className="tease-card">
            <div className="tease-card-row">
              <span>Starter</span>
              <span className="tabular">₹1,999 <em>/mo</em></span>
            </div>
            <hr className="hairline-soft" />
            <div className="tease-card-row tease-card-row-pop">
              <span>Standard</span>
              <span className="tabular">₹4,999 <em>/mo</em></span>
            </div>
            <hr className="hairline-soft" />
            <div className="tease-card-row">
              <span>Premium</span>
              <span className="tabular">₹7,999 <em>/mo</em></span>
            </div>
          </div>
        </div>
      </section>

      {/* HELPER CTA ====================================================== */}
      <section className="helper-cta">
        <div className="page helper-cta-inner">
          <span className="eyebrow eyebrow-light">06 — For helpers</span>
          <h2 className="helper-cta-title">
            Steady work. <em>Real respect.</em> Paid online.
          </h2>
          <p className="helper-cta-deck">
            We don't run a leaderboard. We run a roster of trusted people whose
            calendars stay full. Every month. Verified once, vouched for forever.
          </p>
          <Link to="/signup/helper" className="btn btn-accent btn-arrow">Apply to join</Link>
        </div>
      </section>
    </div>
  );
}
