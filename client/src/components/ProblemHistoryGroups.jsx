
export default function ProblemHistoryGroups({ groups = [], loading = false }) {
  if (loading) {
    return (
      <div className="card loading-card">
        <h2>Multi-Attempt Problems</h2>
        <div className="skeleton-line" style={{ width: '100%', height: '60px', marginTop: '12px' }}></div>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="card">
        <h2>Multi-Attempt Problems</h2>
        <div className="empty-state" style={{ padding: '20px', textAlign: 'center', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', fontWeight: '500' }}>
            No multi-attempt problem groups yet.
          </p>
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#94a3b8' }}>
            When you log repeated attempts for the same problem title, Prep OS automatically groups them to display your solve speed and accuracy progress over time!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Multi-Attempt Problems ({groups.length})</h2>
      <div className="history-group-list">
        {groups.map((g) => (
          <div key={g.title} className="history-group-card">
            <div className="history-group-header">
              <span className="history-group-title">{g.title}</span>
              <span className="topic-tag">{g.topic}</span>
              <span className={`badge ${g.improvement_min > 0 ? 'badge-solved' : 'badge-review'}`}>
                {g.improvement_min > 0
                  ? `? ${g.improvement_min} min faster`
                  : `${g.attempt_count} attempts`}
              </span>
            </div>
            <div className="history-attempts-row">
              {g.attempts.map((a) => (
                <div key={a.id} className="history-attempt-chip">
                  <span className="history-attempt-num">Attempt #{a.attempt_number}</span>
                  <span className="history-attempt-time">{a.time_taken_min} min</span>
                  <span className={`badge badge-${a.status.toLowerCase().replace(' ', '-')}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
