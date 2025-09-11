import React, { useEffect, useState } from "react";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const Leaderboard = ({ limit = 10, showTitle = true }) => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/leaderboard`, { withCredentials: true });
        setLeaders(res.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchLeaders();
  }, []);

  return (
    <div className="leaderboard-wrapper p-4 text-white rounded shadow-md" style={{borderRadius:'15px', border:'2px solid #00ffe0', backgroundColor:'rgba(255, 255, 255, 0.05)'}}>
      {showTitle && <h2 className="neon-title1 mb-3">Leaderboard :-</h2>}
      <ul className="list-group">
        {leaders.slice(0, limit).map((user, index) => (
          <li
            key={user._id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{backgroundColor:"black",color:"#00ffe0"}}
          >
            <span>
              <strong>#{index + 1}</strong> {user.firstName} {user.lastName} (@{user.username})
            </span>
            <span>
              {user.xpPoints} XP | {user.levelBadge}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
