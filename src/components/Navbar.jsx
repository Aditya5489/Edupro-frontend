import React from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      await axios.post(`${baseURL}/api/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully");
      navigate("/home");
    } catch (err) {
      toast.error("Logout failed");
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        backgroundColor: "rgba(26, 26, 46, 0.95)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="container-fluid">
        <span
          className="navbar-brand"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          🎓EduPro
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span
                className="nav-link text-white"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Home
              </span>
            </li>
            <li className="nav-item">
              <span
                className="nav-link text-white"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/about")}
              >
                About
              </span>
            </li>
            <li className="nav-item">
              <span
                className="nav-link text-white"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/contact")}
              >
                Contact
              </span>
            </li>
            {(location.pathname === "/dashboard" || location.pathname === "/profile" || location.pathname==='/skills') && (
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  style={{ cursor: "pointer" }}
                  onClick={logout}
                >
                  Logout
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
