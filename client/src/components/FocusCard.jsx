import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Plus } from 'lucide-react';

const FocusCard = ({ plan = null, loading = false }) => {
  const navigate = useNavigate();
  const todaysFocus = plan?.todays_focus;

  if (loading) {
    return (
      <div className="card loading-card">
        <div className="skeleton-line" style={{ width: '30%', height: '24px', marginBottom: '12px' }}></div>
        <div className="skeleton-line" style={{ width: '80%', height: '16px' }}></div>
      </div>
    );
  }

  if (!todaysFocus) {
    return (
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: '50%', marginBottom: '16px' }}>
          <Target size={32} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', justifyContent: 'center' }}>
          Welcome to Prep OS
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
          Log your first practice problem to unlock personalized daily focus recommendations, multi-factor weakness scores, and intelligent spaced repetition tracking.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/practice')}
        >
          <Plus size={18} />
          Log Your First Problem
        </button>
      </div>
    );
  }

  const score = todaysFocus.weakness_score || 0;
  let scoreColor = 'var(--easy-color)';
  let scoreBg = 'var(--easy-bg)';
  if (score > 60) {
    scoreColor = 'var(--hard-color)';
    scoreBg = 'var(--hard-bg)';
  } else if (score > 30) {
    scoreColor = 'var(--medium-color)';
    scoreBg = 'var(--medium-bg)';
  }

  return (
    <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={14} />
            TODAY'S FOCUS
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {plan?.date || new Date().toISOString().split('T')[0]}
          </span>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: scoreBg, color: scoreColor, fontWeight: 700, fontSize: '0.85rem' }}>
          Weakness Score: {score}/100
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
          {todaysFocus.primary_weak_topic}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {todaysFocus.reason}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Logged Problems</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{todaysFocus.total_problems}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Avg Confidence</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {todaysFocus.avg_confidence !== null && todaysFocus.avg_confidence !== undefined ? `${todaysFocus.avg_confidence}/5` : 'N/A'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Mistakes Tagged</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{todaysFocus.mistake_count}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/practice?topic=${encodeURIComponent(todaysFocus.primary_weak_topic)}`)}
        >
          Practice {todaysFocus.primary_weak_topic} Now
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FocusCard;
