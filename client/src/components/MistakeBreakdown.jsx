import { AlertCircle } from 'lucide-react';

export default function MistakeBreakdown({ mistakeStats = null, loading = false }) {
  if (loading) {
    return (
      <div className="card loading-card">
        <div className="skeleton-line" style={{ width: '30%', height: '24px', marginBottom: '16px' }}></div>
        <div className="skeleton-line" style={{ width: '100%', height: '120px' }}></div>
      </div>
    );
  }

  const {
    mistake_distribution = {},
    total_mistakes_logged = 0,
    top_mistake_reason = 'None',
    weak_topics = []
  } = mistakeStats || {};

  const mistakesList = Object.entries(mistake_distribution);

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <AlertCircle size={18} style={{ color: 'var(--hard-color)' }} />
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Mistake & Weak Area Analysis</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Primary Bottleneck / Mistake
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: top_mistake_reason !== 'None' ? 'var(--hard-color)' : 'var(--text-secondary)', marginTop: '4px' }}>
            {top_mistake_reason !== 'None' ? top_mistake_reason : 'No Mistakes Logged Yet'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {total_mistakes_logged} total mistakes flagged in practice
          </div>
        </div>

        <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Lowest Confidence Focus Area
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: weak_topics.length > 0 ? 'var(--medium-color)' : 'var(--text-secondary)', marginTop: '4px' }}>
            {weak_topics.length > 0 ? weak_topics[0].topic : 'N/A'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {weak_topics.length > 0
              ? `Avg confidence: ${weak_topics[0].avg_confidence !== null && weak_topics[0].avg_confidence !== undefined ? `${weak_topics[0].avg_confidence}/5` : 'N/A'} (${weak_topics[0].total_problems} attempts)`
              : 'Log problems to calculate focus recommendations'}
          </div>
        </div>
      </div>

      {mistakesList.length > 0 ? (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Mistake Category Distribution
          </label>
          <div className="chip-group">
            {mistakesList.map(([type, count]) => (
              <span key={type} className="chip active" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {type}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state" style={{ padding: '16px', marginBottom: '20px' }}>
          No specific mistake patterns tagged yet. Tag mistakes when logging practice attempts to see breakdown patterns here!
        </div>
      )}

      {weak_topics.length > 0 && (
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>
            Topic Weakness Ranking (Sorted by Confidence & Mistakes)
          </label>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Attempts Logged</th>
                  <th>Avg Confidence</th>
                  <th>Mistakes Tagged</th>
                </tr>
              </thead>
              <tbody>
                {weak_topics.map((t) => (
                  <tr key={t.topic}>
                    <td><strong>{t.topic}</strong></td>
                    <td>{t.total_problems}</td>
                    <td>{t.avg_confidence !== null && t.avg_confidence !== undefined ? `${t.avg_confidence}/5` : 'N/A'}</td>
                    <td>
                      {t.mistake_count > 0 ? (
                        <span className="badge badge-review">{t.mistake_count}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
