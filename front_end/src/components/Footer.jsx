import "./Footer.css";

export default function Footer() {
  return (
    <footer className="foot">
      <hr className="hairline" />
      <div className="foot-inner">
        <div className="foot-col">
          <h4 className="foot-title">Urban Mitra</h4>
          <p className="foot-tag-tamil">வணக்கம்.</p>
          <p className="foot-tag">
            One reliable person, <em>not five apps.</em>
          </p>
        </div>

        <div className="foot-col">
          <span className="foot-label">Services</span>
          <ul>
            <li>Cleaning</li>
            <li>Cooking</li>
            <li>Laundry</li>
            <li>Pet walks</li>
            <li>Grocery runs</li>
          </ul>
        </div>

        <div className="foot-col">
          <span className="foot-label">Company</span>
          <ul>
            <li>About</li>
            <li>Helpers</li>
            <li>Trust &amp; verification</li>
            <li>Press</li>
          </ul>
        </div>

        <div className="foot-col foot-col-meta">
          <span className="foot-label">About this build</span>
          <p className="foot-credit">
            A non-commercial test build —<br />
            proudly shipped by{" "}
            <span className="foot-credit-name">Sri-Harini.</span>
          </p>
          <p className="foot-stack">
            <span className="foot-mono">node · express · mysql</span>
            <br />
            <span className="foot-mono">vite · react · vercel</span>
          </p>
        </div>
      </div>
      <div className="foot-strap">
        <span>© 2026 Urban Mitra · A portfolio build, not a real service</span>
        <span className="foot-strap-mono">↪ urban-mitra.onrender.com</span>
      </div>
    </footer>
  );
}
