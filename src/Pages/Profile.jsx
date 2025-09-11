import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Profile.util.css";
import SkillsChart from "../components/Skill";
import Leaderboard from "../components/Leaderboard";
import { toast } from "react-hot-toast"; 
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL;

const ProfileSection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [studyPlans, setStudyPlans] = useState([]); 
  const [selectedPlan, setSelectedPlan] = useState(null); 

  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/profile`, config);
        setUser(res.data);

        const plansRes = await axios.get(`${baseURL}/api/studyplan`, config);
        setStudyPlans(plansRes.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setUploadingPic(true);
      const res = await axios.post(
        `${baseURL}/api/profile/upload-profile-pic`,
        formData,
        {
          config,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser((prev) => ({ ...prev, profileImage: res.data.profileImage }));
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Failed to upload profile picture");
      console.error(err);
    } finally {
      setUploadingPic(false);
    }
  };

  const markPlanCompleted = async (planId) => {
    try {
      await axios.post(
        `${baseURL}/api/studyplan/completed`,
        { planId },
        config
      );
      toast.success("Study Plan marked as completed 🎉");
      setStudyPlans((prev) =>
        prev.map((p) => (p._id === planId ? { ...p, completed: true } : p))
      );
      setUser((prev) => ({ ...prev, xpPoints: prev.xpPoints + 10 }));
    } catch (err) {
      toast.error("Failed to update plan");
    }
  };

  const deletePlan = async (planId) => {
    try {
      await axios.post(
        `${baseURL}/api/studyplan/delete`,
        { planId },
        config
      );
      toast.success("Study Plan deleted successfully 🗑️");
      setStudyPlans((prev) => prev.filter((p) => p._id !== planId));
      if (selectedPlan?._id === planId) setSelectedPlan(null);
    } catch (err) {
      toast.error("Failed to delete plan");
    }
  };

  if (loading)
    return <p className="text-center text-white mt-10">Loading profile...</p>;
  if (!user)
    return (
      <p className="text-center text-red-500 mt-10">Failed to load profile.</p>
    );

  return (
    <div className="profile-wrapper p-6 max-w-2xl mx-auto">
      {/* Header with image + name */}
      <div
        className="profile-header d-flex align-items-center gap-4"
        onClick={() => fileInputRef.current.click()}
        title="Click to change profile picture"
        style={{ cursor: "pointer" }}
      >
        <img
          src={
            user.profileImage ||
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
          }
          alt={user.username}
          className="profile-img"
        />
        <div>
          <h2 className="profile-name neon-title1">
            {user.firstName} {user.lastName}
          </h2>
          <p className="profile-username">@{user.username}</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleProfilePicUpload}
      />

      {uploadingPic && (
        <p className="text-center text-blue-400 mt-2">Uploading image...</p>
      )}

      {/* Stats */}
      <div className="profile-stats mt-4 d-flex justify-content-between">
        <div>
          <h4 className="neon-title">XP Points</h4>
          <p className="stat-value">{user.xpPoints}</p>
        </div>
        <div>
          <h4 className="neon-title">Badges</h4>
          <div className="badges mt-2 d-flex flex-wrap gap-2">
            {user.badges && user.badges.length > 0 ? (
              user.badges.map((badge, i) => (
                <span key={i} className="badge-glass">{badge}</span>
              ))
            ) : (
              <span>No badges yet</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 d-flex justify-content-between" style={{ gap: "2rem" }}>
        
        <div style={{ width: "48%" }}>
          <SkillsChart />
        </div>

        <div style={{ width: "48%" }}>
          <Leaderboard limit={10} />
        </div>
      </div>

      {/* Study Plans Section */}
      {studyPlans.length > 0 && (
        <div className="study-plans mt-5" style={{width:"50%"}}>
          <h3 className="neon-title1" style={{marginBottom:'2rem'}}>My Study Plans :-</h3>
          {studyPlans.map((plan) => (
            <div 
              key={plan._id} 
              className="plan-card mb-3 p-3 rounded"
              style={{ cursor: "pointer" ,border:'2px #00ffe0 solid', backgroundColor:'rgba(255, 255, 255, 0.05)'}}
              onClick={() => navigate(`/planview/${plan._id}`)}
            >
              <h4>{plan.studyGoal}</h4>
              <p>
                Duration: {plan.durationInDays} days | {plan.timePerDay} hrs/day
              </p>
              <p>Status: {plan.completed ? "✅ Completed" : "⏳ In Progress"}</p>

              {!plan.completed && (
                <button
                  className="btn btn-success mt-2"
                  onClick={(e) => { e.stopPropagation(); markPlanCompleted(plan._id); }}
                >
                  Mark Plan Completed
                </button>
              )}
              <button
                className="btn btn-danger mt-2 mx-2"
                onClick={(e) => { e.stopPropagation(); deletePlan(plan._id); }}
              >
                Delete Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Display full plan */}
      {selectedPlan && (
        <StudyPlanView
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};

export default ProfileSection;
