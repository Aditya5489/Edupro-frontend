import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobAnalyzer.util.css"; 

const baseURL = import.meta.env.VITE_API_URL;

const JobAnalyzer = () => {
  const navigate = useNavigate();

  const [jdText, setJdText] = useState("");
  const [fileName, setFileName] = useState("");
  const [extracted, setExtracted] = useState(null);

  const [skills, setSkills] = useState([]);
  const [formSkill, setFormSkill] = useState("");
  const [formProf, setFormProf] = useState("Beginner");

  const [showSkillModal, setShowSkillModal] = useState(false);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/skills`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setSkills(res.data.skills || []);
      } catch (err) {
        console.error("Error fetching skills:", err.response?.data || err.message);
      }
    };

    loadSkills();
  }, []);

  const matchData = useMemo(() => {
    if (!extracted) return { matchPct: 0, matched: [], missing: [] };
    const required = Array.from(
      new Set([...(extracted.technical || []), ...(extracted.tools || [])])
    );
    const userSkillSet = new Set(
      skills.map((s) => s.skillName.trim().toUpperCase())
    );
    const matched = required.filter((r) => userSkillSet.has(r.toUpperCase()));
    const missing = required.filter((r) => !userSkillSet.has(r.toUpperCase()));
    const matchPct = required.length
      ? Math.round((matched.length / required.length) * 100)
      : 0;
    return { matchPct, matched, missing };
  }, [extracted, skills]);

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      setExtracted(null);
      return;
    }
    try {
      const res = await axios.post(
        `${baseURL}/api/analyzejob`,
        { jdText },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setExtracted(res.data.analysis);
    } catch (err) {
      console.error("Error analyzing JD:", err.response?.data || err.message);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    // TODO: send file to backend for parsing
  };

  const addSkill = async () => {
    const clean = formSkill.trim();
    if (!clean) return;
    const newItem = { skillName: clean, proficiency: formProf };
    setSkills((prev) => [...prev, newItem]);

    try {
      await axios.post(
        `${baseURL}/api/skills`,
        { skillName: clean, proficiency: formProf },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
    } catch (err) {
      console.error("Error saving skill:", err.response?.data || err.message);
    }

    setFormSkill("");
    setFormProf("Beginner");
    setShowSkillModal(false);
  };

  const goPlanFor = (skill) => {
    navigate(`/studyplan?goal=Learn%20${encodeURIComponent(skill)}`);
  };

  return (
    <div className="job-page-wrapper">
      <h1 className="neon-title text-center mb-3"> AI Job Description Analyzer</h1>
      <p className="text-white text-center mb-4">
        Paste any job posting and discover the required skills, gaps, and how you compare.
      </p>

      <div className="glass-card p-4 mb-5">
        <div className="mb-3">
          <label className="form-label text-white fw-semibold">Paste Job Description</label>
          <textarea
            className="glass-input form-control"
            rows={6}
            placeholder="Paste job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-white fw-semibold">
            Or Upload Job Description (PDF/DOCX)
          </label>
          <input
            type="file"
            className="glass-input form-control"
            accept=".pdf,.doc,.docx"
            onChange={handleFile}
          />
          {fileName && <small className="text-muted">Selected: {fileName}</small>}
        </div>

        <button className="btn-neon w-100" onClick={handleAnalyze}>
          🔍 Analyze JD
        </button>
      </div>

      {extracted && (
        <>
          {/* Key Skills */}
          <div className="glass-card mb-3 p-3">
            <h5 className="neon-text mb-2">🔹 Key Skills Extracted</h5>
            <div className="mt-3">
              <strong>Technical Skills: </strong>
              {extracted.technical?.length ? (
                extracted.technical.map((s) => (
                  <span key={s} className="badge bg-info text-dark me-2 mb-2">{s}</span>
                ))
              ) : (
                <span className="text-muted">None detected</span>
              )}
            </div>
            <div className="mb-2">
              <strong>Soft Skills: </strong>
              {extracted.soft?.length ? (
                extracted.soft.map((s) => (
                  <span key={s} className="badge bg-secondary me-2 mb-2">{s}</span>
                ))
              ) : (
                <span className="text-muted">None detected</span>
              )}
            </div>
            <div>
              <strong>Tools/Frameworks: </strong>
              {extracted.tools?.length ? (
                extracted.tools.map((s) => (
                  <span key={s} className="badge bg-warning text-dark me-2 mb-2">{s}</span>
                ))
              ) : (
                <span className="text-muted">None detected</span>
              )}
            </div>
          </div>

          {/* Role Summary */}
          <div className="glass-card mb-3 p-3">
            <h5 className="neon-text mb-2 ">🔹 Role Summary</h5>
            <p className="mt-3">{extracted.summary}</p>
          </div>

          {/* Experience & Education */}
          <div className="glass-card mb-3 p-3">
            <h5 className="neon-text mb-2">🔹 Experience & Education Required</h5>
            <ul className="mb-2 mt-3">{extracted.experience?.map((e,i)=><li key={i}>{e}</li>)}</ul>
            <ul>{extracted.education?.map((e,i)=><li key={i}>{e}</li>)}</ul>
          </div>

          {/* Skill Match */}
          <div className="glass-card mb-3 p-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <h5 className="neon-text mb-0">🔹 Skill Match</h5>
              <button className="btn-neon" onClick={() => setShowSkillModal(true)}>➕ Enter Skills</button>
            </div>
            <p><strong>Match:</strong> {matchData.matchPct}%</p>
            <div className="progress mb-3" style={{ height: 10 }}>
              <div className="progress-bar bg-success" style={{ width: `${matchData.matchPct}%` }} />
            </div>
            <p><strong>Matched:</strong> {matchData.matched.length ? matchData.matched.join(", ") : <span className="text-muted">No matches yet</span>}</p>
            <p><strong>Missing:</strong> {matchData.missing.length ? matchData.missing.join(", ") : <span className="text-muted">No gaps detected</span>}</p>
          </div>

          {/* Gap Analysis */}
          <div className="glass-card mb-5 p-3">
            <h5 className="neon-text mb-3">🔹 Gap Analysis & Recommendations</h5>
            {matchData.missing.length === 0 ? (
              <p className="text-success mt-3">Great! You’re fully aligned with the JD skills detected.</p>
            ) : (
              <ul>
                {matchData.missing.map((m) => (
                  <li key={m} className="mb-2 mt-3">
                    ❌ {m} →{" "}
                    <button className="btn btn-sm btn-outline-success" onClick={() => goPlanFor(m)}>
                      Generate Study Plan
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {showSkillModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content glass-card p-3">
              <div className="modal-header">
                <h5 className="neon-text">Enter Your Skills</h5>
                <button type="button" className="btn-close" onClick={() => setShowSkillModal(false)} />
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="glass-input form-control mb-2"
                  placeholder="Skill Name"
                  value={formSkill}
                  onChange={(e) => setFormSkill(e.target.value)}
                />
                <select className="glass-input form-select mb-2" value={formProf} onChange={(e) => setFormProf(e.target.value)}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <button className="btn-neon w-100 mb-3" onClick={addSkill}>Save Skill</button>
                {skills.length > 0 && (
                  <div>
                    <div className="fw-semibold mb-2 text-white">Your Skills</div>
                    {skills.map((s, idx) => (
                      <span key={`${s.skillName}-${idx}`} className="badge bg-dark me-2 mb-2">{s.skillName} • {s.proficiency}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-neon w-100" onClick={() => setShowSkillModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAnalyzer;
