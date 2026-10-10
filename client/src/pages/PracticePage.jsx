import { useSearchParams } from 'react-router-dom';
import { PenTool, History } from 'lucide-react';
import LogForm from '../components/LogForm';
import ProblemList from '../components/ProblemList';

export default function PracticePage({ onProblemAdded, problems, loading }) {
  const [searchParams] = useSearchParams();
  const prefilledTopic = searchParams.get('topic');

  return (
    <div className="dashboard-layout">
      {/* Page Header */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-md)' }}>
            <PenTool size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Practice Attempt Logging</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Record your offline, LeetCode, or Codeforces attempts to track weakness scores & spaced repetition.
            </p>
          </div>
        </div>

        {prefilledTopic && (
          <div style={{ padding: '6px 14px', background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>
            Prefilled Topic: <strong>{prefilledTopic}</strong>
          </div>
        )}
      </div>

      {/* Log Form Component */}
      <LogForm onProblemAdded={onProblemAdded} initialTopic={prefilledTopic} />

      {/* Recent Attempts Log */}
      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <History size={18} style={{ color: 'var(--text-secondary)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Recent Practice Attempts</h2>
        </div>
        <ProblemList problems={problems} loading={loading} />
      </div>
    </div>
  );
}
