import React from "react";

function AnalysisPane({ analysis }) {
  return (
    <div className="analysis">
      <h2>Live Analysis</h2>
      {Object.entries(analysis).map(([key, messages]) => (
        <div key={key}>
          <h3>{key.toUpperCase()}</h3>
          <ul>
            {messages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default AnalysisPane;
