export default function ConsistencyCard({ consistency = null, loading = false }) {
  if (loading || !consistency) {
    return (
      <div className="card">
        <h2>Practice Consistency & Streaks</h2>
        <div className="empty-state">Loading consistency metrics...</div>
      </div>
    );
  }

  const {
    current_streak = 0,
    longest_streak = 0,
    total_active_days = 0,
    last_7_days_count = 0,
    prev_7_days_count = 0,
    velocity_trend = 'up'
  } = consistency;

  return (
    <div className="card">
      <h2>Practice Consistency & Streaks</h2>
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            🔥 {current_streak} {current_streak === 1 ? 'day' : 'days'}
          </div>
          <div className="stat-label">Current Streak</div>
        </div>

        <div className="stat-box">
          <div className="stat-value" style={{ color: '#10b981' }}>
            🏆 {longest_streak} {longest_streak === 1 ? 'day' : 'days'}
          </div>
          <div className="stat-label">Longest Streak</div>
        </div>

        <div className="stat-box">
          <div className="stat-value" style={{ color: '#818cf8' }}>
            📅 {total_active_days}
          </div>
          <div className="stat-label">Total Active Days</div>
        </div>

        <div className="stat-box">
          <div className="stat-value" style={{ color: '#c084fc' }}>
            {last_7_days_count} {velocity_trend === 'up' ? '📈' : '📉'}
          </div>
          <div className="stat-label">Problems (Last 7 Days)</div>
        </div>
      </div>
    </div>
  );
}
