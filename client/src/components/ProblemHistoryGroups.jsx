export default function ProblemHistoryGroups({ groups = [], loading = false }) {
  if (loading || groups.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h2>Multi-Attempt Problems</h2>
      <div className="history-group-list">
        {groups.map((g) => (
          <div key={g.title} className="history-group-card">
            <div className="history-group-header">
              <span className="history-group-title">{g.title}</span>
              <span className="topic-tag">{g.topic}</span>
              <span className={`badge ${g.improvement_min > 0 ? 'badge-solved' : 'badge-review'}`}>
                {g.improvement_min > 0
                  ? `${g.improvement_min} min faster`
                  : `${g.attempt_count} attempts`}
              </span>
            </div>
            <div className="history-attempts-row">
              {g.attempts.map((a) => (
                <div key={a.id} className="history-attempt-chip">
                  <span className="history-attempt-num">Attempt {a.attempt_number}</span>
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