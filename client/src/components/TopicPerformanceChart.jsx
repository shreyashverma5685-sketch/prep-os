import { BarChart3 } from 'lucide-react';

export default function TopicPerformanceChart({ topics = [], loading = false }) {
  if (loading) {
    return (
      <div className="card loading-card">
        <div className="skeleton-line" style={{ width: '30%', height: '24px', marginBottom: '16px' }}></div>
        <div className="skeleton-line" style={{ width: '100%', height: '120px' }}></div>
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BarChart3 size={18} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Topic Performance & Accuracy</h2>
        </div>
        <div className="empty-state" style={{ padding: '24px' }}>
          No problem attempts logged yet. Topic accuracy percentages will calculate automatically as you log problems!
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <BarChart3 size={18} style={{ color: 'var(--accent-primary)' }} />
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Topic Performance & Accuracy</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topics.map((t) => {
          const pct = t.accuracy_pct !== undefined && t.accuracy_pct !== null ? t.accuracy_pct : 0;
          const barColor = pct >= 70 ? 'var(--easy-color)' : pct >= 40 ? 'var(--medium-color)' : 'var(--hard-color)';

          return (
            <div key={t.topic} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.topic}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t.solved_count} solved / {t.total_problems} attempts
                  </span>
                  <span style={{ fontWeight: 700, color: barColor, minWidth: '45px', textAlign: 'right' }}>
                    {pct}%
                  </span>
                </div>
              </div>

              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(0, pct))}%`,
                    backgroundColor: barColor,
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
