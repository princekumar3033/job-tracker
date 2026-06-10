import React from 'react';

const StatCards = ({ jobs }) => {
  const total = jobs.length;
  const applied = jobs.filter((j) => j.status === 'Applied').length;
  const interviews = jobs.filter((j) => j.status === 'Interview').length;
  const offers = jobs.filter((j) => j.status === 'Offer').length;
  const rejected = jobs.filter((j) => j.status === 'Rejected').length;

  // Calculate success rate: (Offers) / Total (excluding active applications if desired, or just standard rates)
  const interviewRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card stat-applied glass-panel">
        <span className="stat-title">Total Applications</span>
        <span className="stat-value">{total}</span>
        <span className="stat-desc">Submissions logged</span>
      </div>

      <div className="stat-card stat-interview glass-panel">
        <span className="stat-title">Interviews Scheduled</span>
        <span className="stat-value">{interviews}</span>
        <span className="stat-desc">{interviewRate}% Callback Rate</span>
      </div>

      <div className="stat-card stat-offer glass-panel">
        <span className="stat-title">Offers Secured</span>
        <span className="stat-value" style={{ color: 'var(--status-offer)' }}>
          {offers}
        </span>
        <span className="stat-desc">Ready to sign</span>
      </div>

      <div className="stat-card stat-rejected glass-panel">
        <span className="stat-title">Rejections</span>
        <span className="stat-value">{rejected}</span>
        <span className="stat-desc">{total > 0 ? Math.round((rejected / total) * 100) : 0}% rejection rate</span>
      </div>
    </div>
  );
};

export default StatCards;
