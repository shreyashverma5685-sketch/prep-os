import { useState, useEffect } from 'react';
import LogForm from './components/LogForm';
import ProblemList from './components/ProblemList';
import './index.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

function App() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/problems`);
      if (res.ok) {
        const data = await res.json();
        setProblems(data);
      } else {
        console.error('Failed to fetch problems:', res.statusText);
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleProblemAdded = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await fetchProblems();
      } else {
        alert('Failed to save problem to server.');
      }
    } catch (err) {
      console.error('Error adding problem:', err);
      alert('Network error submitting problem.');
    }
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
        <ProblemList problems={problems} loading={loading} />
      </main>
    </div>
  );
}

export default App;
