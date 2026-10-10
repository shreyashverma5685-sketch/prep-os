import { Target, Flame, TrendingUp, TrendingDown, Award } from 'lucide-react';

export default function StatsSummary({ summary = null, consistency = null, loading = false }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card loading-card" style={{ padding: '20px' }}>
            <div className="skeleton-line" style={{ width: '50%', height: '16px', marginBottom: '12px' }}></div>
            <div className="skeleton-line" style={{ width: '80%', height: '32px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  const totalProblems = summary?.total_problems || 0;
  const statusBreakdown = summary?.status_breakdown || {};
  const solvedCount = statusBreakdown['Solved'] || 0;
  const attemptedCount = statusBreakdown['Attempted'] || 0;
  const reviewCount = statusBreakdown['Review Needed'] || 0;

  const avgConfidence = summary?.avg_confidence;
  const avgTime = summary?.avg_time_min;

  const currentStreak = consistency?.current_streak || 0;
  const longestStreak = consistency?.longest_streak || 0;
  const totalActive = consistency?.total_active_days || 0;
  const last7 = consistency?.last_7_days_count || 0;
  const prev7 = consistency?.prev_7_days_count || 0;

  let velocityLabel = 'Pace Steady';
  let VelocityIcon = TrendingUp;
  let velocityColor = 'var(--text-secondary)';

  if (last7 > prev7) {
    velocityLabel = 'Pace Accelerating';
    VelocityIcon = TrendingUp;
    velocityColor = 'var(--easy-color)';
  } else if (last7 < prev7) {
    velocityLabel = 'Pace Slowing';
    VelocityIcon = TrendingDown;
    velocityColor = 'var(--medium-color)';
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      {/* Total Attempts & Solved */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Practice Volume
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {totalProblems} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>attempts</span>
            </div>
          </div>
          <div style={{ padding: '8px', background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)' }}>
            <Target size={20} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--easy-color)', fontWeight: 600 }}>{solvedCount} Solved</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--medium-color)', fontWeight: 600 }}>{attemptedCount} Attempted</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--hard-color)', fontWeight: 600 }}>{reviewCount} Review</span>
        </div>
      </div>

      {/* Consistency & Streaks */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Consistency & Streaks
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--medium-color)', marginTop: '4px' }}>
              {currentStreak} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>day streak</span>
            </div>
          </div>
          <div style={{ padding: '8px', background: 'var(--medium-bg)', color: 'var(--medium-color)', borderRadius: 'var(--radius-sm)' }}>
            <Flame size={20} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>Best Streak: <strong>{longestStreak}d</strong></span>
          <span>Active Days: <strong>{totalActive}d</strong></span>
        </div>
      </div>

      {/* Velocity / Weekly Volume */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Weekly Velocity
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
              {last7} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>this week</span>
            </div>
          </div>
          <div style={{ padding: '8px', background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)' }}>
            <VelocityIcon size={20} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
          <span style={{ color: velocityColor, fontWeight: 600 }}>{velocityLabel}</span>
          <span style={{ color: 'var(--text-muted)' }}>vs {prev7} prev week</span>
        </div>
      </div>

      {/* Performance Averages */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Efficiency & Confidence
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {avgConfidence && avgConfidence > 0 ? `${avgConfidence}/5` : 'N/A'}
            </div>
          </div>
          <div style={{ padding: '8px', background: 'var(--easy-bg)', color: 'var(--easy-color)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={20} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>Avg Confidence</span>
          <span>Avg Time: <strong>{avgTime && avgTime > 0 ? `${avgTime}m` : 'N/A'}</strong></span>
        </div>
      </div>
    </div>
  );
}
