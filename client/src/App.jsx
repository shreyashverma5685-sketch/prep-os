import { useState, useEffect } from 'react';
import LogForm from './components/LogForm';
import ProblemList from './components/ProblemList';
import StatsSummary from './components/StatsSummary';
import './index.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

function App() {
  const [problems, setProblems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [probRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE_URL}/problems`),
        fetch(`${API_BASE_URL}/stats/summary`)
      ]);

      if (probRes.ok) {
        const probData = await probRes.json();
        setProblems(probData);
      }
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSummary(summaryData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProblemAdded = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await fetchData();
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
        <StatsSummary summary={summary} loading={loading} />
        <LogForm onProblemAdded={handleProblemAdded} />
        <ProblemList problems={problems} loading={loading} />
      </main>
    </div>
  );
}

export default App;
