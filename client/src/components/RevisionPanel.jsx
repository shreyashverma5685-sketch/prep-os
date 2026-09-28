import  { useState } from 'react';

const RevisionPanel = ({ revisions = [], onCompleteRevision, loading }) => {
  const [pending, setPending] = useState(null);

  const handleOutcome = async (revisionId, outcome) => {
    try {
      setPending({ id: revisionId, outcome });
      if (onCompleteRevision) {
        await onCompleteRevision(revisionId, outcome);
      }
    } finally {
      setPending(null);
    }
  };

  if (loading) {
    return (
      <div className="card revision-panel loading-card">
        <h2>⏰ Revisions Due Today</h2>
        <div className="skeleton-line"></div>
      </div>
    );
  }

  return (
    <div className="card revision-panel">
      <div className="panel-header">
        <h2>⏰ Revisions Due Today</h2>
        <span className="count-badge">{revisions.length} Due</span>
      </div>

      {revisions.length === 0 ? (
        <div className="empty-state">
          <p>🎉 All caught up! No revisions due today.</p>
        </div>
      ) : (
        <div className="revision-list">
          {revisions.map((rev) => {
            const isBusy = pending?.id === rev.revision_id;
            return (
              <div key={rev.revision_id} className="revision-item">
                <div className="revision-main-info">
                  <div className="revision-title-row">
                    <span className="revision-title">{rev.title || `Problem #${rev.problem_id}`}</span>
                    <span className={`badge badge-${(rev.difficulty || 'medium').toLowerCase()}`}>
                      {rev.difficulty || 'Medium'}
                    </span>
                  </div>
                  <div className="revision-meta-row">
                    <span className="topic-tag">{rev.topic}</span>
                    <span className="stage-badge">Stage {rev.interval_stage}</span>
                    {rev.overdue_days > 0 && (
                      <span className="overdue-badge">⚠️ {rev.overdue_days}d overdue</span>
                    )}
                  </div>
                </div>
                <div className="revision-actions">
                  <button
                    className="btn btn-sm btn-success complete-btn"
                    disabled={isBusy}
                    onClick={() => handleOutcome(rev.revision_id, 'success')}
                  >
                    {isBusy && pending.outcome === 'success' ? 'Saving...' : '✓ Complete'}
                  </button>
                  <button
                    className="btn btn-sm btn-danger struggled-btn"
                    disabled={isBusy}
                    onClick={() => handleOutcome(rev.revision_id, 'struggled')}
                  >
                    {isBusy && pending.outcome === 'struggled' ? 'Saving...' : '✗ Struggled'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RevisionPanel;