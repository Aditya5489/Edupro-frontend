import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.util.css";

import plangen from "../assets/plangen.jpg";
import quizgen from "../assets/quizgen.jpg";
import peercob from "../assets/peercob.jpg";
import analysis from "../assets/analysis.jpg";
import gaming from "../assets/gaming.jpg";
import profile from "../assets/profile.jpg";

const baseURL = import.meta.env.VITE_API_URL;

const FeatureHub = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

 
  const checkAuth = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/auth/check`, {
        ...config,
      });
      return res.data.isLoggedIn;
    } catch (err) {
      return false;
    }
  };

  const features = [
    {
      title: "AI Study Plan Generator",
      description: "Create a personalized day-by-day learning path tailored to your goals.",
      image: plangen,
      path: "/studyplan",
    },
    {
      title: "Auto Content Builder",
      description: "Upload notes or PDFs and generate MCQs, flashcards, and short-answer questions.",
      image: quizgen,
      path: "/quizbuilder",
    },
    {
      title: "AI Job description analyzer",
      description: "Analyze job descriptions with AI to find required skills, gaps, and tailored improvement tips.",
      image: analysis,
      path: "/jobanalyzer",
    },
    {
      title: "Peer Collaboration Rooms",
      description: "Collaborate in real-time with peers using whiteboards and chat.",
      image: peercob,
      path: "/homeroom",
    },
    {
      title: "Gamification",
      description: "Earn XP, badges, and climb the leaderboard while learning.",
      image: gaming,
      path: "/gamification",
    },
    {
      title: "My Profile",
      description: "View and manage your personal details, skills, badges, and progress.",
      image: profile,
      path: "/profile",
    },
  ];

  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % features.length);
  const prev = () => setCurrent((prev) => (prev - 1 + features.length) % features.length);

  // ✅ Handle navigation with auth check
  const handleNavigation = async (path) => {
    const loggedIn = await checkAuth();
    if (!loggedIn) {
      toast.error("Please login first");
      return;
    }
    navigate(path);
  };

  return (
    <div className="carousel-wrapper">
      <h1 className="neon-title1 mt-4 text-center">Welcome to Your Feature Hub</h1>

      <div className="carousel">
        {features.map((feature, i) => {
          const offset = (i - current + features.length) % features.length;
          return (
            <div
              key={i}
              className="carousel-card"
              style={{
                "--offset": offset,
                "--total": features.length,
              }}
              onClick={() => handleNavigation(feature.path)} // 👈 updated
            >
              <div className="card feature-card1 text-center">
                <div className="card-upper">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="feature-img"
                  />
                </div>
                <div className="card-lower glass-effect p-3">
                  <h5 className="card-title">{feature.title}</h5>
                  <p className="card-text">{feature.description}</p>
                  <button
                    className="btn btn-primary btn-custom"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation(feature.path); // 👈 updated
                    }}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="controls d-flex justify-content-center gap-5" style={{ marginTop: "80px" }}>
        <button className="arrow-btn prev bg-dark" onClick={prev}></button>
        <button className="arrow-btn next bg-dark" onClick={next}></button>
      </div>
    </div>
  );
};

export default FeatureHub;
