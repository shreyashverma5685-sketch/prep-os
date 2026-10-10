import { Layers, TrendingDown, Clock } from 'lucide-react';

export default function ProblemHistoryGroups({ groups = [], loading = false }) {
  if (loading) {
    return (
      <div className="card loading-card" style={{ marginBottom: '24px' }}>
        <div className="skeleton-line" style={{ width: '30%', height: '24px', marginBottom: '16px' }}></div>
        <div className="skeleton-line" style={{ width: '100%', height: '80px' }}></div>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Layers size={18} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Multi-Attempt Problem Progression</h2>
        </div>
        <div className="empty-state" style={{ padding: '24px' }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600 }}>No multi-attempt problem groups yet.</p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            When you log repeated practice attempts for the same problem title, Prep OS automatically groups them to track your solve speed and accuracy progress over time!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            Multi-Attempt Problem Progression ({groups.length})
          </h2>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Tracking solve speed & accuracy improvements across repeated attempts
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {groups.map((g) => (
          <div
            key={g.title}
            style={{
              padding: '16px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {g.title}
                </span>
                <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
                  {g.topic}
                </span>
              </div>

              {g.improvement_min > 0 ? (
                <span className="badge badge-solved" style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingDown size={14} />
                  {g.improvement_min} min faster ({g.first_attempt_time}m → {g.latest_attempt_time}m)
                </span>
              ) : (
                <span className="badge badge-medium" style={{ fontWeight: 600 }}>
                  {g.attempt_count} attempts
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {g.attempts.map((a) => {
                const statusClass =
                  a.status === 'Solved' ? 'badge-solved' : a.status === 'Attempted' ? 'badge-attempted' : 'badge-review';

                return (
                  <div
                    key={a.id}
                    style={{
                      padding: '8px 12px',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                      #{a.attempt_number}
                    </span>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {a.time_taken_min}m
                    </span>
                    <span className={`badge ${statusClass}`} style={{ fontSize: '0.7rem' }}>
                      {a.status}
                    </span>
                    {a.confidence && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ({a.confidence}/5)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
