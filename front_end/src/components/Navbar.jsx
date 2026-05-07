import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { isAuthed, user, role, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const dashboardPath =
    role === "admin"
      ? "/admin"
      : role === "helper"
      ? "/helper"
      : "/dashboard";

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="Urban Mitra home">
          <span className="nav-mark">um</span>
          <span className="nav-brand-stack">
            <span className="nav-brand-name">Urban Mitra</span>
            <span className="nav-brand-tag">est. 2026 · சென்னை · Chennai</span>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/plans" className="nav-link">Plans</NavLink>
          <NavLink to="/signup/helper" className="nav-link">Become a helper</NavLink>
          {isAuthed && (
            <NavLink to={dashboardPath} className="nav-link">Dashboard</NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {!isAuthed ? (
            <>
              <Link to="/login" className="nav-link">Sign in</Link>
              <Link to="/signup" className="btn btn-sm btn-arrow">Get started</Link>
            </>
          ) : (
            <>
              <span className="nav-greeting">
                <span className="nav-greeting-eyebrow">{role}</span>
                <span className="nav-greeting-name">{user?.fullName?.split(" ")[0]}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-sm btn-ghost">
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
      <hr className="nav-rule" />
    </header>
  );
}
