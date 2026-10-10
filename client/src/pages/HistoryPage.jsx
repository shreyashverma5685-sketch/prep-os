import { History } from 'lucide-react';
import ProblemHistoryGroups from '../components/ProblemHistoryGroups';
import ProblemList from '../components/ProblemList';

export default function HistoryPage({ historyGroups, problems, loading }) {
  return (
    <div className="dashboard-layout">
      {/* Header Banner */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '10px', background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-md)' }}>
          <History size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Problem Attempt History & Progression</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Filter your complete practice logs and inspect solve-speed improvements across multi-attempt groups.
          </p>
        </div>
      </div>

      {/* Multi-Attempt Progression Groups */}
      <ProblemHistoryGroups groups={historyGroups?.groups || []} loading={loading} />

      {/* Complete Log Table with Interactive Filters */}
      <ProblemList problems={problems} loading={loading} />
    </div>
  );
}
