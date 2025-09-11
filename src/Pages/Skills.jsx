// src/Pages/MultiSkillForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Skills.util.css"; 
import { toast } from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_URL;

const MultiSkillForm = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([{ skillName: "", proficiency: "Beginner" }]);

  const handleChange = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  const addRow = () => {
    setSkills([...skills, { skillName: "", proficiency: "Beginner" }]);
  };

  const removeRow = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = skills.filter((s) => s.skillName.trim() !== "");
    if (!payload.length) return;

    try {
      await axios.post(
        `${baseURL}/api/skills/multiple`,
        { skills: payload },
        { withCredentials: true }
      );
      toast.success("Skills added successfully!");
      setSkills([{ skillName: "", proficiency: "Beginner" }]);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add skills. Please try again.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card2">
        <h2 className="text-center neon-title1 mb-3"> Add Your Skills</h2>
        <p className="text-center text-white mb-4">
          Enter all your current skills and proficiency levels. 
          This helps us generate personalized study plans and job readiness insights.
        </p>

        <form onSubmit={handleSubmit}>
          {skills.map((s, idx) => (
            <div key={idx} className="d-flex gap-2 mb-3 skill-row align-items-center">
              <input
                type="text"
                placeholder="Skill name"
                className="form-control glass-input"
                value={s.skillName}
                onChange={(e) => handleChange(idx, "skillName", e.target.value)}
              />
              <select
                className="form-select glass-input "
                value={s.proficiency}
                onChange={(e) => handleChange(idx, "proficiency", e.target.value)}
              >
                <option className="option">Beginner</option>
                <option className="option">Intermediate</option>
                <option className="option">Advanced</option>
              </select>
              {skills.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger remove-btn"
                  onClick={() => removeRow(idx)}
                >
                  ✖
                </button>
              )}
            </div>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <button type="button" className="btn btn-neon" onClick={addRow}>
              + Add Skill
            </button>
            <button
              type="button"
              className="btn btn-neon "
              onClick={() => navigate("/dashboard")}
            >
              Skip Now
            </button>
            <button type="submit" className="btn btn-neon ">
              Submit Skills
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiSkillForm;
