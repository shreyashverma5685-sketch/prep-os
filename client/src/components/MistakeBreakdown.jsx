export default function MistakeBreakdown({ mistakeStats = null, loading = false }) {
  if (loading || !mistakeStats) {
    return (
      <div className="card">
        <h2>Mistake & Weak Area Analysis</h2>
        <div className="empty-state">Loading mistake statistics...</div>
      </div>
    );
  }

  const {
    mistake_distribution = {},
    total_mistakes_logged = 0,
    top_mistake_reason = 'None',
    weak_topics = []
  } = mistakeStats;

  const mistakesList = Object.entries(mistake_distribution);

  return (
    <div className="card">
      <h2>Mistake & Weak Area Analysis</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="stat-box" style={{ textAlign: 'left' }}>
          <div className="stat-label">Primary Bottleneck / Mistake</div>
          <div className="stat-value" style={{ fontSize: '20px', color: '#ef4444', marginTop: '4px' }}>
            {top_mistake_reason !== 'None' ? top_mistake_reason : 'No Mistakes Logged Yet 🎉'}
          </div>
          <div className="stat-label" style={{ marginTop: '4px' }}>
            {total_mistakes_logged} total mistakes flagged across practice history
          </div>
        </div>

        <div className="stat-box" style={{ textAlign: 'left' }}>
          <div className="stat-label">Lowest Confidence Focus Area</div>
          <div className="stat-value" style={{ fontSize: '20px', color: '#f59e0b', marginTop: '4px' }}>
            {weak_topics.length > 0 ? weak_topics[0].topic : 'N/A'}
          </div>
          <div className="stat-label" style={{ marginTop: '4px' }}>
            {weak_topics.length > 0
              ? `Avg confidence: ⭐ ${weak_topics[0].avg_confidence}/5 (${weak_topics[0].total_problems} solved)`
              : 'Log problems to see focus recommendations'}
          </div>
        </div>
      </div>

      {mistakesList.length > 0 ? (
        <div className="form-section">
          <label style={{ fontSize: '14px', fontWeight: '700' }}>Mistake Category Distribution</label>
          <div className="chip-group" style={{ marginTop: '8px' }}>
            {mistakesList.map(([type, count]) => (
              <span key={type} className="chip active" style={{ backgroundColor: '#1e1b4b', borderColor: '#4338ca', color: '#a5b4fc' }}>
                {type}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state" style={{ padding: '16px' }}>
          No specific mistake patterns recorded yet. Select mistake tags when logging problems to track patterns!
        </div>
      )}

      {weak_topics.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
            Topic Performance & Weakness Rank
          </label>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Problems Logged</th>
                  <th>Avg Confidence</th>
                  <th>Mistakes Tagged</th>
                </tr>
              </thead>
              <tbody>
                {weak_topics.map((t) => (
                  <tr key={t.topic}>
                    <td><strong>{t.topic}</strong></td>
                    <td>{t.total_problems}</td>
                    <td>⭐ {t.avg_confidence}/5</td>
                    <td>{t.mistake_count > 0 ? <span className="badge badge-review">{t.mistake_count}</span> : 0}</td>
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
