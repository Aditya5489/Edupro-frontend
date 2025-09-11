import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { closeBrackets } from "@codemirror/autocomplete";

const baseURL = import.meta.env.VITE_API_URL;


const languages = {
  javascript: javascript(),
  python: python(),
  java: java(),
  cpp: cpp(),
  html: html({ autoCloseTags: true }),
};

const Editor = ({ socketRef, roomId, code, onCodeChange }) => {
  const [language, setLanguage] = useState("java");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit("get-code", { roomId });

      socketRef.current.on("send-code", ({ socketId }) => {
        socketRef.current.emit("send-code", { code, socketId });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("send-code");
      }
    };
  }, [socketRef, roomId, code]);

  const runCode = async () => {
  setOutput("Running...");
  try {
    const res = await fetch(`${baseURL}/api/run-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { error: "No response from server" };
    }

    setOutput(data.output || data.error || "No output");
  } catch (err) {
    setOutput("Error: " + err.message);
  }
};

  return (
    <div className="editor-container container mt-4 h-100 w-100" style={{ display: "flex", flexDirection: "column" }}>
      <div className="card shadow-lg border-2" style={{"border":"1px solid white"}}>
        <div className="card-header d-flex justify-content-between align-items-center bg-dark text-light">
          <h5 className="mb-0">💻 Code Editor</h5>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select w-auto dark-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                backgroundColor: "#1e1e2f",
                color: "#f0f0f0",
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 500,
                fontSize: "0.95rem",
                padding: "0.4rem 2rem 0.4rem 0.8rem",
                border: "1px solid #555",
                borderRadius: "0.35rem",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {Object.keys(languages).map((lang) => (
                <option
                  key={lang}
                  value={lang}
                  style={{
                    backgroundColor: "#1e1e2f",
                    color: "#f0f0f0",
                  }}
                >
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            <button className="btn btn-success" onClick={runCode}>
              Run
            </button>
          </div>

          <style>{`
            .dark-select:focus {
              border-color: #0d6efd;
              box-shadow: 0 0 0 0.2rem rgba(13,110,253,0.25);
              outline: none;
            }
          `}</style>
        </div>

        <div className="card-body p-0">
          <CodeMirror
            value={code}
            height="500px"
            theme={dracula}
            extensions={[languages[language], closeBrackets()]}
            onChange={(value) => onCodeChange(value)}
            style={{ flexGrow: 1, height: "100%" }}
          />
        </div>

        {/* Output Panel */}
        <div className="card-footer bg-dark text-light">
          <h6>Output:</h6>
          <pre style={{ whiteSpace: "pre-wrap", minHeight: "50px" }}>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default Editor;
