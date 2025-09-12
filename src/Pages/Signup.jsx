import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Signup.util.css"; 

const baseURL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/api/signup`, formData, {
        withCredentials: true,
      });
      toast.success("User registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
      console.log(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <h2 className="text-center neon-title1 mb-4">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* First & Last Name in same row */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control glass-input"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-control glass-input"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control glass-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
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

          <div className="mb-3">
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
            Sign Up
          </button>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="signup-link">
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
