import React from 'react';

const ActivityPanel = ({ consistency, loading }) => {
  if (loading) {
    return (
      <div className="card activity-panel loading-card">
        <h2>📈 Practice Velocity</h2>
        <div className="skeleton-line"></div>
      </div>
    );
  }

  const currentStreak = consistency?.current_streak || 0;
  const longestStreak = consistency?.longest_streak || 0;
  const last7 = consistency?.last_7_days_count || 0;
  const prev7 = consistency?.prev_7_days_count || 0;
  const velocityTrend = consistency?.velocity_trend || 'up';

  return (
    <div className="card activity-panel">
      <div className="panel-header">
        <h2>📈 Velocity & Activity Engine</h2>
        <span className={`trend-badge trend-${velocityTrend}`}>
          {velocityTrend === 'up' ? '▲ Velocity Up' : '▼ Pace Slowing'}
        </span>
      </div>

      <div className="activity-grid">
        <div className="activity-stat-box highlight-box">
          <span className="stat-label">Current Streak</span>
          <span className="stat-value">{currentStreak} 🔥</span>
          <span className="sub-stat">Best: {longestStreak} days</span>
        </div>

        <div className="activity-stat-box">
          <span className="stat-label">Last 7 Days</span>
          <span className="stat-value">{last7}</span>
          <span className="sub-stat">vs {prev7} prev week</span>
        </div>

        <div className="activity-stat-box">
          <span className="stat-label">Total Active Days</span>
          <span className="stat-value">{consistency?.total_active_days || 0}</span>
          <span className="sub-stat">Unique study days</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;
