import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_URL;

const StudyPlanView = () => {
  const { id } = useParams(); // get plan ID from URL
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/studyplan/${id}`, config);
        setPlan(res.data);
      } catch (err) {
        toast.error("Failed to load plan");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  if (loading) return <p>Loading plan...</p>;
  if (!plan) return <p>Plan not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button className="btn btn-neon  mt-2 mb-4" onClick={() => navigate(-1)}>
         Back
      </button>
      <h2>{plan.studyGoal}</h2>
      <p>
        Duration: {plan.durationInDays} days | {plan.timePerDay} hrs/day
      </p>
      <p>Status: {plan.completed ? "✅ Completed" : "⏳ In Progress"}</p>

      <div className="plan-days mt-4">
        {plan.plan.map((day) => (
          <div key={day.dayNumber} className="day-card mb-3 p-3 border rounded">
            <h4>Day {day.dayNumber}</h4>
            {day.tasks.map((task, i) => (
              <div key={i} className="task-item mb-2">
                <strong>Topic:</strong> {task.topic} <br />
                <strong>Resources:</strong>{" "}
                {task.resources.length > 0
                  ? task.resources.map((r, idx) => (
                      <a
                        key={idx}
                        href={r}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline mr-2"
                      >
                        {r}
                      </a>
                    ))
                  : "None"}{" "}
                <br />
                <strong>YouTube:</strong>{" "}
                {task.youtube.length > 0
                  ? task.youtube.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 underline mr-2"
                      >
                        Video {idx + 1}
                      </a>
                    ))
                  : "None"}
              </div>
            ))}
            {day.milestone && <p><strong>Milestone:</strong> {day.milestone}</p>}
            {day.motivationTip && <p><strong>Tip:</strong> {day.motivationTip}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanView;
