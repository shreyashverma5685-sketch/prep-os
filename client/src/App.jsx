import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import OverviewPage from './pages/OverviewPage';
import PracticePage from './pages/PracticePage';
import AnalyticsPage from './pages/AnalyticsPage';
import RevisionsPage from './pages/RevisionsPage';
import HistoryPage from './pages/HistoryPage';
import apiService from './services/api';
import './index.css';

function App() {
  const [problems, setProblems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [consistency, setConsistency] = useState(null);
  const [mistakeStats, setMistakeStats] = useState(null);
  const [plan, setPlan] = useState(null);
  const [topicPerformance, setTopicPerformance] = useState(null);
  const [historyGroups, setHistoryGroups] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formKey, setFormKey] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllDashboardData();
      setProblems(data.problems);
      setSummary(data.summary);
      setConsistency(data.consistency);
      setMistakeStats(data.mistakeStats);
      setPlan(data.plan);
      setTopicPerformance(data.topicPerformance);
      setHistoryGroups(data.historyGroups);
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
      await apiService.addProblem(formData);
      await fetchData();
      setFormKey((prev) => prev + 1);
    } catch (err) {
      console.error('Error adding problem:', err);
      alert('Failed to save problem to server.');
    }
  };

  const handleCompleteRevision = async (revisionId, outcome = 'success') => {
    try {
      await apiService.completeRevision(revisionId, outcome);
      await fetchData();
    } catch (err) {
      console.error('Error completing revision:', err);
      alert('Failed to complete revision.');
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={
              <OverviewPage
                plan={plan}
                loading={loading}
                problems={problems}
                summary={summary}
                consistency={consistency}
                mistakeStats={mistakeStats}
                topicPerformance={topicPerformance}
                historyGroups={historyGroups}
                handleProblemAdded={handleProblemAdded}
                handleCompleteRevision={handleCompleteRevision}
                formKey={formKey}
              />
            }
          />
          <Route
            path="/practice"
            element={
              <PracticePage
                onProblemAdded={handleProblemAdded}
                problems={problems}
                loading={loading}
              />
            }
          />
          <Route
            path="/analytics"
            element={
              <AnalyticsPage
                summary={summary}
                consistency={consistency}
                mistakeStats={mistakeStats}
                topicPerformance={topicPerformance}
                loading={loading}
              />
            }
          />
          <Route
            path="/revisions"
            element={
              <RevisionsPage
                plan={plan}
                onCompleteRevision={handleCompleteRevision}
                loading={loading}
              />
            }
          />
          <Route
            path="/history"
            element={
              <HistoryPage
                historyGroups={historyGroups}
                problems={problems}
                loading={loading}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
