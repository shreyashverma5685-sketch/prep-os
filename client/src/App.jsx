import { useState } from 'react';
import LogForm from './components/LogForm';
import './index.css';

function App() {
  const [lastLogged, setLastLogged] = useState(null);

  const handleProblemAdded = (formData) => {
    console.log('Logged problem submission (Sub-phase 1c):', formData);
    setLastLogged(formData);
  };

  return (
    <div>
      <header className="app-header">
        <div>
          <div className="brand-title">
            <span>⚡ Prep OS</span>
          </div>
          <div className="brand-subtitle">
            Technical Interview Preparation & Weakness Engine
          </div>
        </div>
      </header>

      <main className="dashboard-layout">
        <LogForm onProblemAdded={handleProblemAdded} />

        {lastLogged && (
          <div className="card">
            <h2>Logged Submission Preview (1c Verification)</h2>
            <pre style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', color: '#10b981', overflowX: 'auto' }}>
              {JSON.stringify(lastLogged, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
