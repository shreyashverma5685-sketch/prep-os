import { useNavigate } from 'react-router-dom';
import { Target, RotateCcw, Flame, History, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import FocusCard from '../components/FocusCard';

export default function OverviewPage({
  plan,
  loading,
  problems = [],
  consistency,
  handleCompleteRevision
}) {
  const navigate = useNavigate();
  const revisionsDue = plan?.revisions_due || [];
  const recentProblems = problems.slice(0, 5);

  const currentStreak = consistency?.current_streak || 0;
  const longestStreak = consistency?.longest_streak || 0;
  const totalActive = consistency?.total_active_days || 0;
  const last7 = consistency?.last_7_days_count || 0;

  return (
    <div className="dashboard-layout">
      {/* Today's Focus Section */}
      <FocusCard plan={plan} loading={loading} />

      <div className="grid-2col">
        {/* Revisions Due Today Concise Summary */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={18} style={{ color: 'var(--accent-primary)' }} />
              Revisions Due Today
            </h2>
            <span className="badge" style={{ backgroundColor: revisionsDue.length > 0 ? 'var(--hard-bg)' : 'var(--easy-bg)', color: revisionsDue.length > 0 ? 'var(--hard-color)' : 'var(--easy-color)', fontWeight: 700 }}>
              {revisionsDue.length} Due
            </span>
          </div>

          {loading ? (
            <div className="skeleton-line" style={{ width: '100%', height: '48px' }}></div>
          ) : revisionsDue.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px' }}>
              <CheckCircle2 size={24} style={{ color: 'var(--easy-color)', marginBottom: '8px' }} />
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--easy-color)' }}>All caught up! No revisions due today.</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Spaced repetition automatically schedules reviews based on memory decay.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {revisionsDue.slice(0, 3).map((rev) => (
                <div key={rev.revision_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{rev.title || `Problem #${rev.problem_id}`}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <span>{rev.topic}</span>
                      <span>•</span>
                      <span>Stage {rev.interval_stage}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleCompleteRevision && handleCompleteRevision(rev.revision_id, 'success')}
                  >
                    Done
                  </button>
                </div>
              ))}
              {revisionsDue.length > 3 && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '4px' }}
                  onClick={() => navigate('/revisions')}
                >
                  View all {revisionsDue.length} due revisions <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Compact Activity Summary */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} style={{ color: 'var(--medium-color)' }} />
              Activity & Consistency
            </h2>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/analytics')}>
              Analytics <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Current Streak</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--medium-color)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Best: {longestStreak} days
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Last 7 Days</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>
                {last7} problems
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Active days: {totalActive}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Problems Preview */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} style={{ color: 'var(--accent-primary)' }} />
            Recent Problem Logs
          </h2>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/history')}>
            View Full History <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="skeleton-line" style={{ width: '100%', height: '60px' }}></div>
        ) : recentProblems.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px' }}>
            No problems logged yet. Navigate to Practice to log your first attempt!
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Topic</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th>Time Spent</th>
                </tr>
              </thead>
              <tbody>
                {recentProblems.map((p) => {
                  const diffClass =
                    p.difficulty === 'Easy' ? 'badge-easy' : p.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard';
                  const statusClass =
                    p.status === 'Solved' ? 'badge-solved' : p.status === 'Attempted' ? 'badge-attempted' : 'badge-review';

                  return (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.title || 'Untitled Problem'}</strong>
                        {p.platform && (
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.platform}</span>
                        )}
                      </td>
                      <td>{p.topic}</td>
                      <td>
                        <span className={`badge ${diffClass}`}>{p.difficulty}</span>
                      </td>
                      <td>
                        <span className={`badge ${statusClass}`}>{p.status}</span>
                      </td>
                      <td>{p.time_taken_min} mins</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
