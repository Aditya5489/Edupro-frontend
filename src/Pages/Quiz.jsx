import React, { useState } from "react";
import axios from "axios";
import "./Quiz.util.css";

const baseURL = import.meta.env.VITE_API_URL;

export default function QuizGenerator() {
  const [file, setFile] = useState(null);
  const [selectedType, setSelectedType] = useState("quiz");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setResult(null);
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload your notes.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", selectedType);

    try {
      const res = await axios.post(`${baseURL}/api/generatecontent`, formData, {
        withCredentials: true,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ====== PARSERS ======
  const parseQuiz = (content) => {
    let clean = content.replace(/\*+/g, "").replace(/^#+\s*/gm, "").trim();
    const firstMatch = clean.match(/\d+\./);
    if (!firstMatch) return [];
    clean = clean.slice(firstMatch.index);
    const raw = clean.split(/\n\d+\./).map(q => q.trim()).filter(Boolean);

    return raw.map((q) => {
      const lines = q.split("\n").map(l => l.trim()).filter(Boolean);
      let answer = "";
      if (lines[lines.length - 1].toLowerCase().includes("correct answer")) {
        answer = lines.pop().replace(/correct answer:*/i, "").trim();
      }
      const questionText = lines.shift() || "";
      return { question: questionText, options: lines, answer };
    });
  };

  const parseFlashcards = (content) => {
    const cards = [];
    const matches = content.split(/\*\*Q:\*\*/i).filter(Boolean);

    matches.forEach((m) => {
      const parts = m.split(/\*\*A:\*\*/i);
      if (parts.length === 2) {
        const questionText = parts[0].replace(/[\*\n]|Card\s*\d+\.?/gi, "").trim();
        const answerText = parts[1].replace(/[\*\n]|Card\s*\d+\.?/gi, "").trim();

        cards.push({
          question: questionText,
          answer: answerText,
        });
      }
    });

    return cards;
  };

  const parseShortAnswers = (content) => {
    const questions = [];
    const blocks = content.split(/\n(?=\d+\.\s*Question:)/);
    blocks.forEach((block) => {
      const qMatch = block.match(/^\d+\.\s*Question:\s*(.*)/i);
      const aMatch = block.match(/Answer:\s*(.*)/i);
      if (qMatch) {
        questions.push({
          id: questions.length + 1,
          text: qMatch[1].trim(),
          answer: aMatch ? aMatch[1].trim() : "",
        });
      }
    });
    return questions;
  };

  // ====== COMPONENTS ======
  const QuizCard = ({ index, question }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    return (
      <div className="quiz-card p-3 rounded glass-card shadow-sm">
        <strong className="text-white">{index + 1}. {question.question}</strong>
        <ul className="mt-2 text-white">
          {question.options.map((opt, i) => <li key={i}>{opt}</li>)}
        </ul>
        <button className="btn-neon mt-2" onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
        {showAnswer && (
          <div className="mt-2 p-2 glass-subcard text-white">
            Correct Answer: {question.answer}
          </div>
        )}
      </div>
    );
  };

  const Flashcard = ({ index, card }) => {
    const [flipped, setFlipped] = useState(false);

    return (
      <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
        <div className="flashcard-inner">
          <div className="flashcard-front d-flex align-items-center justify-content-center">
            <p className="text-center"><strong>{index + 1}.</strong> {card.question}</p>
          </div>
          <div className="flashcard-back d-flex align-items-center justify-content-center">
            <p className="text-center">{card.answer}</p>
          </div>
        </div>
      </div>
    );
  };

  // ====== RENDERERS ======
  const renderQuiz = () => {
    if (!result || selectedType !== "quiz") return null;
    return (
      <div className="mb-4" style={{width: '100%', marginLeft:'600px'}}>
        <h4 className="neon-text mb-3"> Generated Quiz:-</h4>
        <div className="d-flex flex-column gap-3">
          {parseQuiz(result.content).map((q, i) => <QuizCard key={i} index={i} question={q} />)}
        </div>
      </div>
    );
  };

  const renderFlashcards = () => {
    if (!result || selectedType !== "flashcard") return null;
    return (
      <div className="mb-4" style={{width: '100%'}}>
        <h4 className="neon-text mb-3"> Generated Flashcards:-</h4>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          {parseFlashcards(result.content).map((c, i) => <Flashcard key={i} index={i} card={c} />)}
        </div>
      </div>
    );
  };

  const renderShortAnswers = () => {
    if (!result || selectedType !== "short-answer") return null;
    return (
      <div className="mb-4" style={{width: '50%'}}>
        <h4 className="neon-text mb-3"> Generated Short Answer Questions:-</h4>
        <div className="d-flex flex-column gap-3">
          {parseShortAnswers(result.content).map((q) => (
            <div key={q.id} className="p-3 border rounded bg-black text-neon shadow-sm">
              <strong>{q.id}. {q.text}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ====== MAIN RENDER ======
  return (
    <div className="quiz-page-wrapper">
      <h1 className="quiz-title text-center neon-text mb-3">EduPro - Auto Content Generator</h1>
      <p className="text-white text-center mb-4">
        Challenge yourself with quizzes, reinforce learning using flashcards, and practice key concepts through short answer questions with AI-generated content.
      </p>

      <div className="quiz-card mb-5 p-4 glass-card " style={{border:"1px solid #00f2ffff" , shadow:"0 0 20px #00f2ffff"}}>
        <div className="mb-3">
          <label className="form-label text-white">Upload Your Notes</label>
          <input type="file" className="glass-input form-control" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <div className="mb-3">
          <label className="form-label text-white">Select Content Type</label>
          <select className="glass-input form-select" value={selectedType} onChange={handleTypeChange}>
            <option value="quiz" className="option">🧠 Quizzes (MCQs)</option>
            <option value="flashcard" className="option">🃏 Flashcards</option>
            <option value="short-answer" className="option">🧩 Short Answer Questions</option>
          </select>
        </div>
        <button className="btn-neon" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "🚀 Generate"}
        </button>
      </div>

      {renderQuiz()}
      {renderFlashcards()}
      {renderShortAnswers()}
    </div>
  );
}
