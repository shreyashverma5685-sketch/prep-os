import { useState, useEffect } from 'react';
import FocusCard from './components/FocusCard';
import RevisionPanel from './components/RevisionPanel';
import ActivityPanel from './components/ActivityPanel';
import LogForm from './components/LogForm';
import ProblemList from './components/ProblemList';
import StatsSummary from './components/StatsSummary';
import ConsistencyCard from './components/ConsistencyCard';
import MistakeBreakdown from './components/MistakeBreakdown';
import './index.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

function App() {
  const [problems, setProblems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [consistency, setConsistency] = useState(null);
  const [mistakeStats, setMistakeStats] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formKey, setFormKey] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [probRes, summaryRes, consistencyRes, mistakesRes, planRes] = await Promise.all([
        fetch(`${API_BASE_URL}/problems`),
        fetch(`${API_BASE_URL}/stats/summary`),
        fetch(`${API_BASE_URL}/stats/consistency`),
        fetch(`${API_BASE_URL}/stats/mistakes`),
        fetch(`${API_BASE_URL}/plan`)
      ]);

      if (probRes.ok) setProblems(await probRes.json());
      if (summaryRes.ok) setSummary(await summaryRes.json());
      if (consistencyRes.ok) setConsistency(await consistencyRes.json());
      if (mistakesRes.ok) setMistakeStats(await mistakesRes.json());
      if (planRes.ok) setPlan(await planRes.json());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setFormKey((prev) => prev + 1);
    } else {
      alert('Failed to save problem to server.');
    }
  } catch (err) {
    console.error('Error adding problem:', err);
    alert('Network error submitting problem.');
  }
};

  const handleCompleteRevision = async (revisionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/revisions/${revisionId}/complete`, {
        method: 'POST'
      });
      if (res.ok) {
        await fetchData();
      } else {
        alert('Failed to complete revision.');
      }
    } catch (err) {
      console.error('Error completing revision:', err);
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
        <FocusCard plan={plan} loading={loading} />
        <div className="grid-2col">
          <RevisionPanel 
            revisions={plan?.revisions_due || []} 
            onCompleteRevision={handleCompleteRevision} 
            loading={loading} 
          />
          <ActivityPanel consistency={consistency} loading={loading} />
        </div>
        <div className="grid-2col">
          <StatsSummary summary={summary} loading={loading} />
          <ConsistencyCard consistency={consistency} loading={loading} />
        </div>
        <MistakeBreakdown mistakeStats={mistakeStats} loading={loading} />
        <div id="log-form-section">
          <LogForm key={formKey} onProblemAdded={handleProblemAdded} />
        </div>
        <ProblemList problems={problems} loading={loading} />
      </main>
    </div>
  );
}

export default App;
