import { useState, useMemo } from 'react';
import { History, Filter, Search, RotateCcw, AlertCircle } from 'lucide-react';
import { TOPICS } from './LogForm';

export default function ProblemList({ problems = [], loading = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');

  // Extract unique platforms present in dataset
  const availablePlatforms = useMemo(() => {
    const set = new Set();
    problems.forEach((p) => {
      if (p.platform) set.add(p.platform);
    });
    return Array.from(set).sort();
  }, [problems]);

  // Combined real-time multi-filter logic
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // 1. Search Query Filter (Title or Subtopic or Topic)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = (p.title || '').toLowerCase().includes(query);
        const subtopicMatch = (p.subtopic || '').toLowerCase().includes(query);
        const topicMatch = (p.topic || '').toLowerCase().includes(query);
        if (!titleMatch && !subtopicMatch && !topicMatch) return false;
      }

      // 2. Topic Filter
      if (selectedTopic !== 'All' && (p.topic || '').toLowerCase() !== selectedTopic.toLowerCase()) {
        return false;
      }

      // 3. Difficulty Filter
      if (selectedDifficulty !== 'All' && (p.difficulty || '').toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      // 4. Status Filter
      if (selectedStatus !== 'All' && (p.status || '').toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }

      // 5. Platform Filter
      if (selectedPlatform !== 'All' && (p.platform || '').toLowerCase() !== selectedPlatform.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [problems, searchQuery, selectedTopic, selectedDifficulty, selectedStatus, selectedPlatform]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedTopic !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedStatus !== 'All' ||
    selectedPlatform !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setSelectedPlatform('All');
  };

  if (loading) {
    return (
      <div className="card loading-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="skeleton-line" style={{ width: '35%', height: '24px' }}></div>
        </div>
        <div className="skeleton-line" style={{ width: '100%', height: '160px' }}></div>
      </div>
    );
  }

  if (!problems || problems.length === 0) {
    return (
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <History size={18} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Complete Problem History</h2>
        </div>
        <div className="empty-state" style={{ padding: '28px' }}>
          No problem attempts logged yet. Log your first problem attempt to start building your history!
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={20} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>
            Complete Problem History ({filteredProblems.length} of {problems.length})
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleResetFilters}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} /> Reset Filters
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {/* Search Input */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Search Title / Pattern</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Topic Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Topic</label>
            <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
              <option value="All">All Topics</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Difficulty</label>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Attempted">Attempted</option>
              <option value="Review Needed">Review Needed</option>
            </select>
          </div>

          {/* Platform Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Platform</label>
            <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
              <option value="All">All Platforms</option>
              {availablePlatforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table / Empty Filtered State */}
      {filteredProblems.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px' }}>
          <AlertCircle size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
          <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'var(--text-primary)' }}>
            No problem logs match your selected filters.
          </p>
          <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Try adjusting your search criteria or resetting filters to view problem history.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
            <RotateCcw size={14} /> Clear All Filters
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Problem Title / Platform</th>
                <th>Topic / Pattern</th>
                <th>Difficulty</th>
                <th>Time Spent</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Mistake Tag</th>
                <th>Date Logged</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((prob) => {
                const diffClass =
                  prob.difficulty === 'Easy'
                    ? 'badge-easy'
                    : prob.difficulty === 'Medium'
                    ? 'badge-medium'
                    : 'badge-hard';

                const statusClass =
                  prob.status === 'Solved'
                    ? 'badge-solved'
                    : prob.status === 'Attempted'
                    ? 'badge-attempted'
                    : 'badge-review';

                return (
                  <tr key={prob.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{prob.id}</td>
                    <td>
                      <strong>{prob.title || 'Untitled Problem'}</strong>
                      {prob.platform && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {prob.platform}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{prob.topic}</span>
                      {prob.subtopic && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {prob.subtopic}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${diffClass}`}>{prob.difficulty || 'Medium'}</span>
                    </td>
                    <td>{prob.time_taken_min} mins</td>
                    <td>
                      <span className={`badge ${statusClass}`}>{prob.status}</span>
                    </td>
                    <td>
                      {prob.confidence !== null && prob.confidence !== undefined ? (
                        <strong>{prob.confidence}/5</strong>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                      )}
                    </td>
                    <td>
                      {prob.mistake_type && prob.mistake_type !== 'None' ? (
                        <span className="badge badge-review">{prob.mistake_type}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {prob.date_logged ? prob.date_logged.split('T')[0] : 'Today'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
