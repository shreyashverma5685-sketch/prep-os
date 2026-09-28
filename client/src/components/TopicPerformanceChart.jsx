export default function TopicPerformanceChart({ topics = [], loading = false }) {
  if (loading) {
    return (
      <div className="card">
        <h2>Topic Performance</h2>
        <div className="empty-state">Loading topic performance...</div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="card">
        <h2>Topic Performance</h2>
        <div className="empty-state">
          No problems logged yet. Accuracy per topic will appear here.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Topic Performance</h2>
      <div className="topic-perf-list">
        {topics.map((t) => {
          const barColor =
            t.accuracy_pct >= 70 ? '#10b981' : t.accuracy_pct >= 40 ? '#f59e0b' : '#ef4444';
          return (
            <div key={t.topic} className="topic-perf-row">
              <div className="topic-perf-label">
                <span>{t.topic}</span>
                <span className="topic-perf-pct">{t.accuracy_pct}%</span>
              </div>
              <div className="topic-perf-track">
                <div
                  className="topic-perf-bar"
                  style={{ width: `${t.accuracy_pct}%`, backgroundColor: barColor }}
                />
              </div>
              <div className="topic-perf-sub">
                {t.solved_count} / {t.total_problems} solved
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}