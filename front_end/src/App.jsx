import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./routes/PrivateRoute";

import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Login from "./pages/Login";
import SignupUser from "./pages/SignupUser";
import SignupHelper from "./pages/SignupHelper";
import BookService from "./pages/BookService";
import UserDashboard from "./pages/UserDashboard";
import HelperDashboard from "./pages/HelperDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <div className="top-progress" key={useLocation().pathname} />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupUser />} />
          <Route path="/signup/helper" element={<SignupHelper />} />

          <Route
            path="/book"
            element={
              <PrivateRoute allow={["user"]}>
                <BookService />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allow={["user"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/helper"
            element={
              <PrivateRoute allow={["helper"]}>
                <HelperDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allow={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
