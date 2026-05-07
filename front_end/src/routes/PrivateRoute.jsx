import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PrivateRoute({ allow, children }) {
  const { isAuthed, role } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allow && !allow.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
