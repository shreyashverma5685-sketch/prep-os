import { useState, useEffect } from 'react';
import { PenTool, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const TOPICS = [
  'Arrays', 'Strings', 'Hash Map', 'Two Pointers', 'Sliding Window',
  'Binary Search', 'Trees', 'Graphs', 'Dynamic Programming',
  'Heap / Priority Queue', 'Stack / Queue', 'Greedy', 'Bit Manipulation', 'Other'
];

export const MISTAKE_TYPES = [
  'None', 'Syntax', 'Off-by-one', 'Edge Case',
  'Time Limit Exceeded', 'Logic / Conceptual',
  'Memory / Space', 'Misread Spec'
];

export default function LogForm({ onProblemAdded, initialTopic }) {
  const getValidTopic = (topStr) => {
    if (!topStr) return 'Arrays';
    const matched = TOPICS.find((t) => t.toLowerCase() === topStr.trim().toLowerCase());
    return matched || 'Arrays';
  };

  const getInitialState = () => ({
    title: '',
    platform: 'LeetCode',
    topic: getValidTopic(initialTopic),
    subtopic: '',
    difficulty: 'Medium',
    time_taken_min: 20,
    status: 'Solved',
    attempts: 1,
    confidence: null, // Unrated by default
    hints_used: 0,
    mistake_type: null // Optional
  });

  const [formData, setFormData] = useState(getInitialState);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialTopic) {
      const valid = getValidTopic(initialTopic);
      setFormData((prev) => ({ ...prev, topic: valid }));
    }
  }, [initialTopic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'time_taken_min' || name === 'attempts' || name === 'hints_used'
        ? (value === '' ? '' : Number(value))
        : value
    }));
  };

  const handleConfidenceSelect = (val) => {
    setFormData((prev) => ({
      ...prev,
      confidence: val
    }));
  };

  const handleMistakeSelect = (val) => {
    setFormData((prev) => ({
      ...prev,
      mistake_type: val === 'None' ? null : val
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.topic || !formData.difficulty || !formData.status || !formData.time_taken_min) {
      setErrorMsg('Please fill in all required fields (Topic, Difficulty, Time Spent, Status).');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        time_taken_min: Number(formData.time_taken_min) || 15,
        attempts: Number(formData.attempts) || 1,
        hints_used: Number(formData.hints_used) || 0,
        title: formData.title.trim() || null,
        subtopic: formData.subtopic.trim() || null,
        confidence: formData.confidence !== null ? Number(formData.confidence) : null,
        mistake_type: formData.mistake_type && formData.mistake_type !== 'None' ? formData.mistake_type : null
      };

      if (onProblemAdded) {
        await onProblemAdded(payload);
      }
      setSuccessMsg('Problem attempt logged successfully!');
      setFormData(getInitialState());
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg(err.message || 'Failed to save problem to server. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card form-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <PenTool size={20} style={{ color: 'var(--accent-primary)' }} />
        <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Log Practice Attempt</h2>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', background: 'var(--easy-bg)', color: 'var(--easy-color)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: 'var(--hard-bg)', color: 'var(--hard-color)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="log-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Problem Title / Number</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 1. Two Sum"
            />
          </div>

          <div className="form-group">
            <label htmlFor="platform">Platform</label>
            <select id="platform" name="platform" value={formData.platform} onChange={handleChange}>
              <option value="LeetCode">LeetCode</option>
              <option value="HackerRank">HackerRank</option>
              <option value="Codeforces">Codeforces</option>
              <option value="InterviewBit">InterviewBit</option>
              <option value="Custom">Custom / Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="topic">Topic *</label>
            <select id="topic" name="topic" value={formData.topic} onChange={handleChange} required>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subtopic">Subtopic / Pattern</label>
            <input
              type="text"
              id="subtopic"
              name="subtopic"
              value={formData.subtopic}
              onChange={handleChange}
              placeholder="e.g. Prefix Sum, Monotonic Stack"
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty *</label>
            <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} required>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="time_taken_min">Time Spent (minutes) *</label>
            <input
              type="number"
              id="time_taken_min"
              name="time_taken_min"
              value={formData.time_taken_min}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="Solved">Solved</option>
              <option value="Attempted">Attempted</option>
              <option value="Review Needed">Review Needed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="attempts">Attempts</label>
            <input
              type="number"
              id="attempts"
              name="attempts"
              value={formData.attempts}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hints_used">Hints / Solution Looked Up</label>
            <input
              type="number"
              id="hints_used"
              name="hints_used"
              value={formData.hints_used}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Confidence rating tap-select chips */}
        <div className="form-section" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Confidence Rating (Optional)
          </label>
          <div className="chip-group">
            <button
              type="button"
              className={`chip ${formData.confidence === null ? 'active' : ''}`}
              onClick={() => handleConfidenceSelect(null)}
            >
              Unrated (N/A)
            </button>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`chip ${formData.confidence === lvl ? 'active' : ''}`}
                onClick={() => handleConfidenceSelect(lvl)}
              >
                {lvl} {lvl === 1 ? '— Low' : lvl === 5 ? '— High' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Mistake type tap-select chips */}
        <div className="form-section" style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Primary Mistake / Bottleneck (Optional)
          </label>
          <div className="chip-group">
            {MISTAKE_TYPES.map((type) => {
              const isActive = (type === 'None' && !formData.mistake_type) || formData.mistake_type === type;
              return (
                <button
                  key={type}
                  type="button"
                  className={`chip ${isActive ? 'active' : ''}`}
                  onClick={() => handleMistakeSelect(type)}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              'Save Practice Log'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
