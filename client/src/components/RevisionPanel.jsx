import { useState } from 'react';
import { RotateCcw, CheckCircle2, AlertTriangle, Loader2, Sparkles } from 'lucide-react';

export default function RevisionPanel({ revisions = [], onCompleteRevision, loading }) {
  const [pendingId, setPendingId] = useState(null);
  const [pendingOutcome, setPendingOutcome] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOutcome = async (revisionId, outcome) => {
    try {
      setErrorMsg('');
      setPendingId(revisionId);
      setPendingOutcome(outcome);
      if (onCompleteRevision) {
        await onCompleteRevision(revisionId, outcome);
      }
    } catch (err) {
      console.error('Error in revision outcome:', err);
      setErrorMsg(`Failed to save revision outcome for #${revisionId}. Please try again.`);
    } finally {
      setPendingId(null);
      setPendingOutcome(null);
    }
  };

  if (loading) {
    return (
      <div className="card loading-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="skeleton-line" style={{ width: '40%', height: '24px' }}></div>
          <div className="skeleton-line" style={{ width: '15%', height: '24px' }}></div>
        </div>
        <div className="skeleton-line" style={{ width: '100%', height: '60px', marginBottom: '12px' }}></div>
        <div className="skeleton-line" style={{ width: '100%', height: '60px' }}></div>
      </div>
    );
  }

  const overdueCount = revisions.filter((r) => r.overdue_days > 0).length;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RotateCcw size={20} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>Spaced Revisions Queue</h2>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {overdueCount > 0 && (
            <span className="badge badge-hard" style={{ fontWeight: 700 }}>
              {overdueCount} Overdue
            </span>
          )}
          <span className="badge" style={{ backgroundColor: revisions.length > 0 ? 'var(--accent-light)' : 'var(--easy-bg)', color: revisions.length > 0 ? 'var(--accent-primary)' : 'var(--easy-color)', fontWeight: 700 }}>
            {revisions.length} Total Due
          </span>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: 'var(--hard-bg)', color: 'var(--hard-color)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} />
          {errorMsg}
        </div>
      )}

      {revisions.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px 24px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--easy-bg)', color: 'var(--easy-color)', borderRadius: '50%', marginBottom: '12px' }}>
            <CheckCircle2 size={32} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--easy-color)', margin: '0 0 6px' }}>
            All Caught Up! No Revisions Due Today
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto' }}>
            Your spaced repetition queue automatically schedules reviews when confidence is low or mistakes occur. Check back tomorrow!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {revisions.map((rev) => {
            const isBusy = pendingId === rev.revision_id;
            const diffClass =
              rev.difficulty === 'Easy' ? 'badge-easy' : rev.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard';

            return (
              <div
                key={rev.revision_id}
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: rev.overdue_days > 0 ? '#fff5f5' : 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${rev.overdue_days > 0 ? '#fecaca' : 'var(--border-color)'}`,
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {rev.title || `Problem #${rev.problem_id}`}
                    </span>
                    <span className={`badge ${diffClass}`}>{rev.difficulty || 'Medium'}</span>
                    {rev.overdue_days > 0 ? (
                      <span className="badge badge-hard" style={{ fontSize: '0.7rem' }}>
                        <AlertTriangle size={12} style={{ marginRight: '4px' }} />
                        {rev.overdue_days}d overdue
                      </span>
                    ) : (
                      <span className="badge badge-solved" style={{ fontSize: '0.7rem' }}>
                        Due Today
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Topic: <strong>{rev.topic}</strong></span>
                    {rev.subtopic && <span>• Pattern: <strong>{rev.subtopic}</strong></span>}
                    <span>• Stage: <strong>Stage {rev.interval_stage}</strong></span>
                    {rev.confidence && <span>• Confidence: <strong>{rev.confidence}/5</strong></span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-sm btn-success"
                    disabled={isBusy}
                    onClick={() => handleOutcome(rev.revision_id, 'success')}
                  >
                    {isBusy && pendingOutcome === 'success' ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} /> Complete
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    disabled={isBusy}
                    onClick={() => handleOutcome(rev.revision_id, 'struggled')}
                  >
                    {isBusy && pendingOutcome === 'struggled' ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Resetting...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={14} /> Struggled
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
