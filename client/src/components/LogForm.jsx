import { useState } from 'react';

const TOPICS = [
  'Arrays', 'Strings', 'Hash Map', 'Two Pointers', 'Sliding Window',
  'Binary Search', 'Trees', 'Graphs', 'Dynamic Programming',
  'Heap / Priority Queue', 'Stack / Queue', 'Greedy', 'Bit Manipulation', 'Other'
];

const MISTAKE_TYPES = [
  'None', 'Syntax', 'Off-by-one', 'Edge Case',
  'Time Limit Exceeded', 'Logic / Conceptual',
  'Memory / Space', 'Misread Spec'
];

export default function LogForm({ onProblemAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    topic: 'Arrays',
    subtopic: '',
    difficulty: 'Medium',
    time_taken_min: 20,
    status: 'Solved',
    attempts: 1,
    confidence: 3,
    hints_used: 0,
    mistake_type: 'None'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'time_taken_min' || name === 'attempts' || name === 'hints_used'
        ? Number(value)
        : value
    }));
  };

  const handleChipSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.topic || !formData.difficulty || !formData.status) {
      alert('Please fill in required fields (Topic, Difficulty, Status).');
      return;
    }
    if (onProblemAdded) {
      onProblemAdded(formData);
    }
  };

  return (
    <div className="card form-card">
      <h2>Log Solved / Attempted Problem</h2>
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
        <div className="form-section">
          <label>Confidence Rating (1 = Struggled, 5 = Mastered)</label>
          <div className="chip-group">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`chip ${formData.confidence === lvl ? 'active' : ''}`}
                onClick={() => handleChipSelect('confidence', lvl)}
              >
                {lvl} {lvl === 1 ? '⭐ Low' : lvl === 5 ? '⭐ High' : '⭐'}
              </button>
            ))}
          </div>
        </div>

        {/* Mistake type tap-select chips */}
        <div className="form-section">
          <label>Primary Mistake / Bottleneck</label>
          <div className="chip-group">
            {MISTAKE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`chip ${formData.mistake_type === type ? 'active' : ''}`}
                onClick={() => handleChipSelect('mistake_type', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Submit Log Entry
          </button>
        </div>
      </form>
    </div>
  );
}
