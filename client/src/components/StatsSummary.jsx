export default function StatsSummary({ summary = null, loading = false }) {
  if (loading || !summary) {
    return (
      <div className="card">
        <h2>Core Practice Metrics</h2>
        <div className="empty-state">Loading core statistics...</div>
      </div>
    );
  }

  const {
    total_problems = 0,
    difficulty_breakdown = { Easy: 0, Medium: 0, Hard: 0 },
    avg_confidence = 0,
    avg_time_min = 0,
    status_breakdown = {}
  } = summary;

  return (
    <div className="card">
      <h2>Core Practice Metrics</h2>
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#818cf8' }}>{total_problems}</div>
          <div className="stat-label">Total Problems</div>
        </div>

        <div className="stat-box">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {difficulty_breakdown.Easy}
          </div>
          <div className="stat-label">Easy Solved</div>
        </div>

        <div className="stat-box">
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {difficulty_breakdown.Medium}
          </div>
          <div className="stat-label">Medium Solved</div>
        </div>

        <div className="stat-box">
          <div className="stat-value" style={{ color: '#ef4444' }}>
            {difficulty_breakdown.Hard}
          </div>
          <div className="stat-label">Hard Solved</div>
        </div>

        <div className="stat-box">
          <div className="stat-value" style={{ color: '#c084fc' }}>
            {avg_confidence > 0 ? `⭐ ${avg_confidence}` : 'N/A'}
          </div>
          <div className="stat-label">Avg Confidence</div>
        </div>

        <div className="stat-box">
          <div className="stat-value" style={{ color: '#38bdf8' }}>
            {avg_time_min > 0 ? `${avg_time_min}m` : '0m'}
          </div>
          <div className="stat-label">Avg Time / Problem</div>
        </div>
      </div>
    </div>
  );
}
