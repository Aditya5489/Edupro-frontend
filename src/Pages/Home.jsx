import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import HeroImage1 from "../assets/hero-image01.jpg";
import HeroImage2 from "../assets/hero-image02.jpg";
import HeroImage3 from "../assets/hero-image03.jpg";
import { FaRobot, FaQuestionCircle, FaUsers, FaChartLine, FaMedal } from "react-icons/fa";
import "./Home.util.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const getAuthConfig = () => {
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  }
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/auth/check`, {
          ...getAuthConfig(),
        });
        if (res.data.isLoggedIn) setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="py-5 hero-section">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Text */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold text-white">
                Learn smarter,<br /> grow faster, achieve more.
              </h1>
              <p className="lead hero-text">
                EduPro empowers you to learn at your own pace, wherever and whenever it’s most convenient.
                Build skills, connect with peers, and prepare for your dream career.
              </p>
              <button
                className="btn btn-neon1"
                onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
                style={{marginLeft:"0"}}
              >
                Get Started →
              </button>
            </div>

            {/* Right Images */}
            <div className="col-lg-6 d-flex gap-3">
              <div className="hero-image-card tall-card">
                <img src={HeroImage1} alt="Student 1" />
              </div>

              <div className="d-flex flex-column gap-3" style={{ flex: 1 }}>
                <div className="hero-image-card half-card">
                  <img src={HeroImage2} alt="Student 2" />
                </div>
                <div className="hero-image-card half-card">
                  <img src={HeroImage3} alt="Student 3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 text-center features-section">
        <div className="container">
          <h1 className="fw-bold mb-5 text-white neon-title">Our Core Capabilities</h1>
          <div className="row g-4 justify-content-center mt-2">
            <div className="col-md-4 col-sm-6">
              <div className="feature-card p-4 h-100">
                <div className="icon-wrapper">
                  <FaRobot size={50} className="text-primary mb-3" />
                </div>
                <h5>AI Study Plan Generator</h5>
                <p>Get a personalized day-by-day learning path based on your goals, time, and skill level.</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="feature-card p-4 h-100">
                <div className="icon-wrapper">
                  <FaQuestionCircle size={50} className="text-success " />
                </div>
                <h5>Auto Quiz Builder</h5>
                <p>Upload notes or PDFs to automatically create quizzes, flashcards, and leaderboards.</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="feature-card p-4 h-100">
                <div className="icon-wrapper">
                  <FaUsers size={50} className="text-warning " />
                </div>
                <h5>Peer Collaboration Rooms</h5>
                <p>Join study groups with real-time whiteboards, code editors, and video chat.</p>
              </div>
            </div>
            <div className="col-md-4  col-sm-6" >
              <div className="feature-card p-4 h-100">
                <div className="icon-wrapper">
                  <FaChartLine size={50} className="text-danger " />
                </div>
                <h5>Job Readiness Tracker</h5>
                <p>Track your skills, find in-demand ones, and close the gap with AI recommendations.</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="feature-card p-4 h-100">
                <div className="icon-wrapper">
                  <FaMedal size={50} className="text-info " />
                </div>
                <h5>Gamification</h5>
                <p>Earn XP, badges, and climb leaderboards for completing courses and challenges.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
