import React from 'react';
import CodeEditor from './CodeEditor';


function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Live Code Analyzer</h1>
      <p style={{ textAlign: 'center' }}>Analyze your Python code in real-time for issues and improvements ✨</p>
      <CodeEditor />
      <footer className="footer">
        <p style={{ textAlign: 'center' }}>Made with ❤️ by ByteBuilders | Powered by Flask & React</p>
      </footer>
    </div>
  );
}

export default App;
