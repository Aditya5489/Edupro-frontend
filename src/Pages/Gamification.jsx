import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Gamification.util.css";

const baseURL = import.meta.env.VITE_API_URL;

const GamificationChallenge = () => {
  const [language, setLanguage] = useState("JavaScript");
  const [challenge, setChallenge] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Helper to get auth config
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  const getChallenge = async () => {
    setLoading(true);
    setFeedback("");
    setFixedCode("");

    try {
      const res = await axios.post(
        `${baseURL}/api/gamification/challenge`,
        { language },
        getAuthConfig()
      );
      setChallenge(res.data);
      setUserCode(res.data.buggyCode);
    } catch (err) {
      toast.error("Failed to load challenge.");
    } finally {
      setLoading(false);
    }
  };

  const validateSolution = async () => {
    if (!userCode || !challenge) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${baseURL}/api/gamification/validate`,
        {
          userCode,
          language,
          description: challenge.description,
        },
        getAuthConfig()
      );

      setFeedback(
        res.data.isCorrect
          ? "✅ Correct! +20 XP 🎉"
          : `❌ Incorrect: ${res.data.feedback}`
      );

      if (res.data.isCorrect) {
        setTimeout(() => getChallenge(), 1500);
      }
    } catch {
      toast.error("Validation failed.");
    } finally {
      setLoading(false);
    }
  };

  const correctCode = async () => {
    if (!userCode || !challenge) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${baseURL}/api/gamification/correct`,
        {
          userCode,
          language,
          description: challenge.description,
        },
        getAuthConfig()
      );

      setFixedCode(res.data.fixedCode);
      setFeedback("🛠️ AI provided a corrected solution!");
    } catch {
      toast.error("Correction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gamification-page-wrapper">
      <div className="gamification-overlay "></div>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="gamification-card">
          <h2 className="text-center neon-title1 mb-4">
            Fix the AI Buggy Code Challenge
          </h2>

          <div className="mb-3 text-start">
            <label className="form-label">Choose Language:</label>
            <select
              className="ml-2 p-2 border rounded glass-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ marginLeft: "20px" }}
            >
              <option className="option">JavaScript</option>
              <option className="option">Python</option>
              <option className="option">Java</option>
              <option className="option">C++</option>
            </select>
          </div>

          <button
            onClick={getChallenge}
            className="btn-neon w-100 mb-4"
            disabled={loading}
          >
            {loading ? "Loading..." : "🎯 Get Challenge"}
          </button>

          {challenge && (
            <>
              <h3 className="text-lg font-bold">{challenge.title}</h3>
              <p className="text-gray-300 mb-3">{challenge.description}</p>

              <textarea
                rows="10"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="border p-3 font-mono rounded glass-input"
                style={{ width: "100%" }}
              />

              <div className="mt-4 flex gap-8">
                <button
                  onClick={validateSolution}
                  className="btn-neon1"
                  disabled={loading}
                >
                  ✅ Validate
                </button>
                <button
                  onClick={correctCode}
                  className="btn-neon1"
                  disabled={loading}
                >
                  🛠️ Fix with AI
                </button>
              </div>
            </>
          )}

          {feedback && <p className="mt-4 neon-feedback">{feedback}</p>}

          {fixedCode && (
            <div className="mt-4">
              <h4 className="font-bold">AI Corrected Code:</h4>
              <pre className="bg-gray-900 p-3 rounded overflow-x-auto text-green-300">
                {fixedCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationChallenge;
