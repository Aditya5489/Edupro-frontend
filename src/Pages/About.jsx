import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./About.util.css"; 
import about from "../assets/About2.jpeg";

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="py-5 about-hero">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-lg-7 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold text-white">About EduPro</h1>
              <p className="lead about-text">
                EduPro isn’t your regular study app — it’s your learning buddy 🚀.  
                We make studying fun, personalized, and effective with AI-powered
                tools, quizzes, collaboration rooms, and even gamified challenges.  
                Whether you’re preparing for exams, upgrading your coding skills,  
                or aiming for your dream job — EduPro’s got your back!
              </p>
              <p className="about-text">
                Our mission is simple: help students learn smarter, stay motivated,  
                and build the future they dream of 💡.
              </p>
            </div>

            {/* Right Image */}
            <div className="col-lg-5 text-center">
              <div className="about-image-card">
                <img
                  src={about}
                  alt="About EduPro"
                  className="img-fluid rounded shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why EduPro Section */}
      <section className="py-5 text-center about-features">
        <div className="container">
          <h2 className="fw-bold mb-4 text-white about-title">Why EduPro?</h2>
          <p className="lead text-white mb-5">
            Because learning shouldn’t feel boring. We bring students together,  
            make tough topics simple, and add a spark of fun to every step 🎯.
          </p>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="about-card p-4 h-100">
                <h5>🎓 Student-First</h5>
                <p>Every feature is designed to make your learning smoother and smarter.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="about-card p-4 h-100">
                <h5>🤝 Community</h5>
                <p>Study together, collaborate, and grow with like-minded peers.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="about-card p-4 h-100">
                <h5>⚡ Motivation</h5>
                <p>XP, badges, and leaderboards keep you excited to keep going.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
