
import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (code.trim()) {
        axios
          .post("http://localhost:5050/analyze", { code })
          .then((res) => setAnalysis(res.data))
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.syntax_errors
            ) {
              setAnalysis({
                error: "⚠️ Syntax/Indentation Error",
                details: error.response.data.syntax_errors,
              });
            } else {
              setAnalysis({
                error: "⚠️ Analysis failed. Please check backend.",
                details: [error.message],
              });
            }
          });
      } else {
        setAnalysis(null);
      }
    }, 1000); // debounce delay

    return () => clearTimeout(timer);
  }, [code]);

  const renderList = (title, list, emoji) =>
    list.length > 0 && (
      <div style={{ marginBottom: "10px" }}>
        <h4>
          {emoji} {title}
        </h4>
        <ul>
          {list.map((item, index) => (
            <li key={index} style={{ marginBottom: "4px" }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Code Editor */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2 style={{ marginBottom: "10px" }}>📝 Python Code Editor</h2>
        <CodeMirror
          value={code}
          height="90vh"
          extensions={[python()]}
          theme="light"
          onChange={(value) => setCode(value)}
        />
      </div>

      {/* Analysis Results */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f9f9f9",
          overflowY: "auto",
        }}
      >
        <h2>🔍 Live Analysis</h2>

        {analysis?.error ? (
          <div style={{ color: "red" }}>
            <h4>{analysis.error}</h4>
            <ul>
              {analysis.details?.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        ) : analysis ? (
          <div>
            {renderList("🚨 AST Issues", analysis.ast_issues, "❗")}
            {renderList("🧠 Complexity Issues", analysis.complexity_issues, "🧩")}
            {renderList("💾 Memory Warnings", analysis.memory_warnings, "📦")}
            {renderList("🗑️ Unused Variables", analysis.unused_warnings, "🚫")}
            {renderList("💡 Suggestions", analysis.suggestions, "💡")}
            {renderList("❌ Syntax Errors", analysis.syntax_errors, "⚠️")}

            {analysis.time_complexity && (
              <div style={{ marginBottom: "10px" }}>
                <h4 style={{ color: "#4a148c" }}>⏱️ Time Complexity</h4>
                <p style={{ fontWeight: "bold", color: "#1a237e" }}>{analysis.time_complexity}</p>
              </div>
            )}
            {analysis.space_complexity && (
              <div style={{ marginBottom: "10px" }}>
                <h4 style={{ color: "#2e7d32" }}>💽 Space Complexity</h4>
                <p style={{ fontWeight: "bold", color: "#1b5e20" }}>{analysis.space_complexity}</p>
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontStyle: "italic", color: "#777" }}>
            Start typing to see analysis here...
          </p>
        )}
      </div>
    </div>
    
  );
};

export default CodeEditor;
