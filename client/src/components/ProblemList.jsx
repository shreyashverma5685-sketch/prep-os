export default function ProblemList({ problems = [], loading = false }) {
  if (loading) {
    return (
      <div className="card">
        <h2>Problem History</h2>
        <div className="empty-state">Loading logged problems...</div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="card">
        <h2>Problem History</h2>
        <div className="empty-state">
          No problems logged yet. Fill out the form above to log your first practice problem!
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Problem History ({problems.length})</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Problem</th>
              <th>Topic / Pattern</th>
              <th>Difficulty</th>
              <th>Time</th>
              <th>Status</th>
              <th>Confidence</th>
              <th>Mistake Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((prob) => {
              const diffClass =
                prob.difficulty === 'Easy'
                  ? 'badge-easy'
                  : prob.difficulty === 'Medium'
                  ? 'badge-medium'
                  : 'badge-hard';

              const statusClass =
                prob.status === 'Solved'
                  ? 'badge-solved'
                  : prob.status === 'Attempted'
                  ? 'badge-attempted'
                  : 'badge-review';

              return (
                <tr key={prob.id}>
                  <td>#{prob.id}</td>
                  <td>
                    <strong>{prob.title || 'Untitled Problem'}</strong>
                    {prob.platform && (
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {prob.platform}
                      </span>
                    )}
                  </td>
                  <td>
                    <span>{prob.topic}</span>
                    {prob.subtopic && (
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {prob.subtopic}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${diffClass}`}>{prob.difficulty}</span>
                  </td>
                  <td>{prob.time_taken_min} mins</td>
                  <td>
                    <span className={`badge ${statusClass}`}>{prob.status}</span>
                  </td>
                  <td>
                    {prob.confidence ? `⭐ ${prob.confidence}/5` : '-'}
                  </td>
                  <td>
                    {prob.mistake_type && prob.mistake_type !== 'None' ? (
                      <span className="badge badge-review">{prob.mistake_type}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td>{prob.date_logged || 'Today'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
