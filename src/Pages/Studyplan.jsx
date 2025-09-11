import React, { useState } from "react";
import axios from "axios";
import "./Studyplan.util.css"; 

const baseURL = import.meta.env.VITE_API_URL;

export default function StudyPlanGenerator() {
  const [formData, setFormData] = useState({
    studyGoal: "",
    timePerDay: "",
    skillLevel: "beginner",
    durationInDays: ""
  });

  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generatePlan = async () => {
    setError("");
    setLoading(true);
    setStudyPlan(null);

    try {
      const res = await axios.post(
        `${baseURL}/api/studyplan/generateplan`,
        {
          studyGoal: formData.studyGoal,
          timePerDay: Number(formData.timePerDay),
          skillLevel: formData.skillLevel,
          durationInDays: Number(formData.durationInDays)
        },
        { withCredentials: true }
      );
      setStudyPlan(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="studyplan-wrapper">
      <div className="glass-card">
        {/* Heading */}
        <div className="text-center mb-4">
          <h1 className="fw-bold neon-text">AI Study Plan Generator</h1>
          <p className="text-light">
            Get a personalized day-by-day learning path tailored to your goals.
          </p>
        </div>

        {/* Form */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-white fw-semibold">Study Goal</label>
            <input
              type="text"
              className="form-control glass-input"
              name="studyGoal"
              placeholder="e.g. Learn React"
              value={formData.studyGoal}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label text-white fw-semibold">Hours Per Day</label>
            <input
              type="number"
              className="form-control glass-input"
              name="timePerDay"
              placeholder="e.g. 2"
              value={formData.timePerDay}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label text-white fw-semibold">Skill Level</label>
            <select
              className="form-select glass-input"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
            >
              <option value="beginner" className="option">Beginner</option>
              <option value="intermediate" className="option">Intermediate</option>
              <option value="advanced" className="option">Advanced</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label text-white fw-semibold">Total Days</label>
            <input
              type="number"
              className="form-control glass-input"
              name="durationInDays"
              placeholder="e.g. 30"
              value={formData.durationInDays}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-neon"
            onClick={generatePlan}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Plan"}
          </button>
        </div>

        {error && <p className="text-danger text-center mt-3">{error}</p>}
      </div>

      {/* Results */}
      {studyPlan && Array.isArray(studyPlan.plan) && (
        <div className="glass-card mt-5 ">
          <h3 className="fw-bold neon-text mb-4">Generated Study Plan :-</h3>
          <div className="row g-4 mt-2">
            {studyPlan.plan.map((day) => (
              <div className="col-md-6" key={day.dayNumber}>
                <div className="glass-subcard h-100">
                  <div className="card-body">
                    <h5 className="fw-bold text-info mb-3">
                      📅 Day {day.dayNumber}
                    </h5>

                    {/* Documentation Section */}
                    <div className="mb-3 mt-2">
                      <h6 className="fw-bold text-light">📘 Documentation & Articles</h6>
                      <ul className="list-unstyled">
                        {day.tasks.map((task, idx) => (
                          <li key={idx} className="mb-2">
                            <p className="text-white fw-semibold">🧩 {task.topic}</p>
                            {task.resources && task.resources.length > 0 ? (
                              <ul>
                                {task.resources.map((res, rIdx) => (
                                  <li key={rIdx}>
                                    <a
                                      href={res}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="neon-link"
                                    >
                                      {res}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted fst-italic">No docs provided</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* YouTube Section */}
                    <div className="mb-3">
                      <h6 className="fw-bold text-light">▶ YouTube Videos & Playlists</h6>
                      <ul className="list-unstyled">
                        {day.tasks.map((task, idx) => (
                          <li key={idx} className="mb-3">
                            <p className="text-white fw-semibold">🧩 {task.topic}</p>
                            {task.youtube && task.youtube.length > 0 ? (
                              <ul className="list-unstyled d-flex flex-wrap gap-3">
                                {task.youtube.map((yt, yIdx) => {
                                  const youtubeMatch = yt.match(
                                    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                                  );
                                  const videoId = youtubeMatch ? youtubeMatch[1] : null;

                                  return (
                                    <li key={yIdx} className="d-flex flex-column align-items-center">
                                      {videoId ? (
                                        <>
                                          <img
                                            src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                                            alt="YouTube Thumbnail"
                                            className="yt-thumb"
                                          />
                                          <button
                                            className="btn btn-danger mt-2 fw-semibold"
                                            onClick={() => window.open(yt, "_blank", "noopener,noreferrer")}
                                          >
                                            Watch
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          className="btn btn-danger fw-semibold"
                                          onClick={() => window.open(yt, "_blank", "noopener,noreferrer")}
                                        >
                                          Watch
                                        </button>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p className="text-muted fst-italic">No videos provided</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Milestone & Motivation */}
                    {day.milestone && (
                      <p className="fw-semibold text-success">
                        🎯 Milestone: {day.milestone}
                      </p>
                    )}
                    {day.motivationTip && (
                      <p className="fst-italic text-light">💡 {day.motivationTip}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
