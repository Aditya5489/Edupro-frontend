import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import StudyPlan from './Pages/Studyplan';
import QuizGenerator from './Pages/Quiz'
import JobAnalyzer from './Pages/Jobanalyzer';
import MultiSkillForm from './Pages/Skills';
import HomeRoom from './Pages/HomeRoom';
import Room from './Pages/Room';
import GamificationChallenge from './Pages/Gamification';
import Profile from './Pages/Profile';
import StudyPlanView from './Pages/StudyPlanView';
import About from './Pages/About';
import Contact from './Pages/Contact';
import {Toaster} from 'react-hot-toast';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/studyplan" element={<StudyPlan />} />
          <Route path="/quizbuilder" element={<QuizGenerator />} />
          <Route path="/jobanalyzer" element={<JobAnalyzer />} />
          <Route path="/skills" element={<MultiSkillForm />} />
          <Route path="/homeroom" element={<HomeRoom />} />
          <Route path="/room/:id" element={<Room />} />
          <Route path="/gamification" element={<GamificationChallenge />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/planview/:id" element={<StudyPlanView />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "#d1fae5",
              color: "#065f46",
              border: "1px solid #10b981",
            },
          },
          error: {
            style: {
              background: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #ef4444",
            },
          },
        }}
      />
    </div>
  );
};

export default App;
