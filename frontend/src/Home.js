import React from 'react';
import CodeEditor from './CodeEditor';
import LiveAnalysis from './LiveAnalysis';
import './Home.css';
import { FaCode } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="container">
      <header className="header">
        <FaCode className="logo-icon" />
        <h1>Live Code Analyzer</h1>
        <p className="subheading">Analyze your Python code in real-time for issues and improvements ✨</p>
      </header>

      <main className="main">
        <section className="editor-section">
          <h2>📝 Write Your Code</h2>
          <CodeEditor />
        </section>

        <section className="analysis-section">
          <h2>🔍 Live Analysis</h2>
          <LiveAnalysis />
        </section>
      </main>

      <footer className="footer">
        <p>Made with ❤️ by ByteBuilders | Powered by Flask & React</p>
      </footer>
    </div>
  );
};

export default Home;
