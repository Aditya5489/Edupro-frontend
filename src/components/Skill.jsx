import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const baseURL = import.meta.env.VITE_API_URL;

const SkillsChart = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/skills`, config);

        // Ensure array format
        const skillArray = Array.isArray(res.data)
          ? res.data
          : res.data.skills || [];

        // Map proficiency labels to numeric values
        const proficiencyMap = {
          Beginner: 30,
          Intermediate: 60,
          Advanced: 90,
        };

        const formatted = skillArray.map((s) => ({
          skillName: s.skillName,
          proficiency: proficiencyMap[s.proficiency] || 0,
        }));

        setSkills(formatted);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) return <p className="text-white">Loading skills...</p>;
  if (!skills.length) return <p className="text-red-400">No skills found</p>;

  return (
    <div className="skills-wrapper p-6 mt-7 " style={{borderRadius:'15px', border:'2px solid #00ffe0', backgroundColor:'rgba(255, 255, 255, 0.05)'}}>
      <h3 className="neon-title1 mb-4" style={{marginTop:"2rem", marginLeft:"20px"}}>Skill Proficiency:-</h3>
      <div style={{ width: "100%", height: "500px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skills}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skillName"  />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Proficiency"
              dataKey="proficiency"
              stroke="#00ffe0"
              fill="#ff00ff"
              fillOpacity={0.5}
            />
            <Tooltip 
                contentStyle={{
                background: "rgba(10, 10, 20, 0.85)",
                border: "1px solid #00ffe0",
                borderRadius: "10px",
                padding: "8px",
                color: "#fff",
                boxShadow: "0 0 10px #00ffe0, 0 0 20px #ff00ff"
                }}
                labelStyle={{ color: "#ff00ff", fontWeight: "600" }}
                itemStyle={{ color: "#00ffe0", fontWeight: "500" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillsChart;
