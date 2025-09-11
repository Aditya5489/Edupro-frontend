import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.util.css"; 

const baseURL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/api/login`, formData, {
        withCredentials: true,
      });
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/skills");
      }, 2000);
      console.log(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-overlay"></div>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-card">
          <h2 className="text-center neon-title1 mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control glass-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control glass-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-neon w-100 mt-3">
              Login
            </button>

            <p className="text-center mt-4 text-light">
              Don't have an account?{" "}
              <span
                className="signup-link"
                onClick={() => navigate("/signup")}
              >
                Signup
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
