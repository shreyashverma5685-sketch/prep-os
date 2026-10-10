import { RotateCcw, Info, CalendarCheck } from 'lucide-react';
import RevisionPanel from '../components/RevisionPanel';

export default function RevisionsPage({ plan, onCompleteRevision, loading }) {
  const revisions = plan?.revisions_due || [];

  return (
    <div className="dashboard-layout">
      {/* Header Banner */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-md)' }}>
            <RotateCcw size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Spaced Repetition Schedule</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Review problem concepts at optimal interval stages to maximize long-term retention.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <CalendarCheck size={16} style={{ color: 'var(--accent-primary)' }} />
          <span>Queue Date: <strong>{plan?.date || new Date().toISOString().split('T')[0]}</strong></span>
        </div>
      </div>

      {/* Main Revisions Panel */}
      <RevisionPanel
        revisions={revisions}
        onCompleteRevision={onCompleteRevision}
        loading={loading}
      />

      {/* Spaced Repetition Interval Legend */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Info size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>How Spaced Repetition Works in Prep OS</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.5 }}>
          When you mark a revision as <strong>Complete</strong>, it advances to the next interval stage. If you mark it as <strong>Struggled</strong>, it resets to Stage 0 so you review it again tomorrow.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {[
            { stage: 'Stage 0', interval: '1 day' },
            { stage: 'Stage 1', interval: '3 days' },
            { stage: 'Stage 2', interval: '7 days' },
            { stage: 'Stage 3', interval: '14 days' },
            { stage: 'Stage 4', interval: '30 days' }
          ].map((s) => (
            <div key={s.stage} style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{s.stage}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>{s.interval}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
