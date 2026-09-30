
const FocusCard = ({ plan = null, loading = false }) => {
  const todaysFocus = plan?.todays_focus;

  if (loading) {
    return (
      <div className="card focus-card loading-card">
        <div className="focus-header">
          <span className="focus-badge">?? TODAY'S FOCUS</span>
        </div>
        <div className="skeleton-line" style={{ width: '60%', height: '24px', margin: '12px 0' }}></div>
        <div className="skeleton-line" style={{ width: '40%', height: '16px' }}></div>
      </div>
    );
  }

  if (!todaysFocus) {
    return (
      <div className="card focus-card empty-focus">
        <div className="focus-header">
          <div className="focus-badge-wrapper">
            <span className="focus-badge">?? GET STARTED</span>
            <span className="focus-date">{plan?.date || new Date().toISOString().split('T')[0]}</span>
          </div>
        </div>
        <div className="focus-main" style={{ textAlign: 'center', padding: '16px 0' }}>
          <h2 className="focus-topic-title" style={{ fontSize: '20px', marginBottom: '8px' }}>
            Welcome to Prep OS
          </h2>
          <p className="focus-reason" style={{ maxWidth: '480px', margin: '0 auto 16px' }}>
            Log your first practice problem to unlock personalized daily focus recommendations, multi-factor weakness scores, and intelligent spaced repetition tracking.
          </p>
          <button
            className="btn btn-primary focus-btn"
            onClick={() => {
              const el = document.getElementById('log-form-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            + Log Your First Problem
          </button>
        </div>
      </div>
    );
  }

  const score = todaysFocus.weakness_score || 0;
  let scoreColor = '#10B981'; // green
  if (score > 60) scoreColor = '#EF4444'; // red
  else if (score > 30) scoreColor = '#F59E0B'; // yellow

  return (
    <div className="card focus-card">
      <div className="focus-header">
        <div className="focus-badge-wrapper">
          <span className="focus-badge">?? TODAY'S FOCUS</span>
          <span className="focus-date">{plan?.date || new Date().toISOString().split('T')[0]}</span>
        </div>
        <div className="weakness-score-pill" style={{ borderColor: scoreColor, color: scoreColor }}>
          Weakness Score: {score}/100
        </div>
      </div>

      <div className="focus-main">
        <h2 className="focus-topic-title">{todaysFocus.primary_weak_topic}</h2>
        <p className="focus-reason">{todaysFocus.reason}</p>

        <div className="focus-stats-row">
          <div className="focus-stat-item">
            <span className="stat-label">Logged Problems</span>
            <span className="stat-value">{todaysFocus.total_problems}</span>
          </div>
          <div className="focus-stat-item">
            <span className="stat-label">Avg Confidence</span>
            <span className="stat-value">
              {todaysFocus.avg_confidence !== null ? `? ${todaysFocus.avg_confidence} / 5` : 'N/A'}
            </span>
          </div>
          <div className="focus-stat-item">
            <span className="stat-label">Mistakes Tagged</span>
            <span className="stat-value">{todaysFocus.mistake_count}</span>
          </div>
        </div>

        <div className="focus-actions">
          <button 
            className="btn btn-primary focus-btn"
            onClick={() => {
              const el = document.getElementById('log-form-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Practice {todaysFocus.primary_weak_topic} Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusCard;
