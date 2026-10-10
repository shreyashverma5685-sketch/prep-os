import { BarChart3 } from 'lucide-react';
import StatsSummary from '../components/StatsSummary';
import TopicPerformanceChart from '../components/TopicPerformanceChart';
import MistakeBreakdown from '../components/MistakeBreakdown';

export default function AnalyticsPage({ summary, consistency, mistakeStats, topicPerformance, loading }) {
  return (
    <div className="dashboard-layout">
      {/* Header Banner */}
      <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '10px', background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-md)' }}>
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Practice Analytics & Weakness Engine</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Inspect problem breakdown, practice velocity, topic accuracy percentages, and mistake patterns.
          </p>
        </div>
      </div>

      {/* Consolidated Executive KPIs */}
      <StatsSummary summary={summary} consistency={consistency} loading={loading} />

      {/* Topic Accuracy Chart */}
      <TopicPerformanceChart topics={topicPerformance?.topics || []} loading={loading} />

      {/* Mistake Distribution & Topic Weakness Rank */}
      <MistakeBreakdown mistakeStats={mistakeStats} loading={loading} />
    </div>
  );
}
