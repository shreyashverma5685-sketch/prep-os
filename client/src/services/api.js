const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`API Error [${response.status}] ${response.statusText}: ${errorText}`);
  }
  return response.json();
}

export const apiService = {
  getProblems: () => request('/problems'),
  getSummary: () => request('/stats/summary'),
  getConsistency: () => request('/stats/consistency'),
  getMistakes: () => request('/stats/mistakes'),
  getPlan: () => request('/plan'),
  getTopicPerformance: () => request('/stats/topic-performance'),
  getHistoryGroups: () => request('/problems/history-groups'),

  addProblem: (formData) =>
    request('/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }),

  completeRevision: (revisionId, outcome = 'success') =>
    request(`/revisions/${revisionId}/complete?outcome=${outcome}`, {
      method: 'POST'
    }),

  async getAllDashboardData() {
    const [
      problems,
      summary,
      consistency,
      mistakes,
      plan,
      topicPerformance,
      historyGroups
    ] = await Promise.allSettled([
      this.getProblems(),
      this.getSummary(),
      this.getConsistency(),
      this.getMistakes(),
      this.getPlan(),
      this.getTopicPerformance(),
      this.getHistoryGroups()
    ]);

    return {
      problems: problems.status === 'fulfilled' ? problems.value : [],
      summary: summary.status === 'fulfilled' ? summary.value : null,
      consistency: consistency.status === 'fulfilled' ? consistency.value : null,
      mistakeStats: mistakes.status === 'fulfilled' ? mistakes.value : null,
      plan: plan.status === 'fulfilled' ? plan.value : null,
      topicPerformance: topicPerformance.status === 'fulfilled' ? topicPerformance.value : null,
      historyGroups: historyGroups.status === 'fulfilled' ? historyGroups.value : null
    };
  }
};

export default apiService;
