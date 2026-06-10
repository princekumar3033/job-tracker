import React from 'react';

const JobTable = ({ jobs, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (jobs.length === 0) {
    return (
      <div
        style={{
          padding: '3rem',
          textAlign: 'center',
          color: '#8c869c',
          background: 'rgba(20, 18, 38, 0.2)',
          border: '1px dashed var(--border-glass)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        No job applications found matching the selected filters.
      </div>
    );
  }

  return (
    <div className="table-responsive glass-panel">
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Date Applied</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td className="table-company-cell">
                {job.jobUrl ? (
                  <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
              </td>
              <td className="table-role-cell">{job.role}</td>
              <td>{formatDate(job.dateApplied)}</td>
              <td>
                <span className={`badge badge-${job.status.toLowerCase()}`}>
                  {job.status}
                </span>
              </td>
              <td className="table-notes-cell" title={job.notes}>
                {job.notes || <span style={{ color: '#4c485c', fontStyle: 'italic' }}>No notes</span>}
              </td>
              <td className="table-actions">
                <button
                  className="icon-btn icon-btn-edit"
                  onClick={() => onEdit(job)}
                  title="Edit Job"
                  aria-label="Edit job details"
                  style={{ padding: '0.4rem' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button
                  className="icon-btn icon-btn-delete"
                  onClick={() => onDelete(job._id)}
                  title="Delete Job"
                  aria-label="Delete job application"
                  style={{ padding: '0.4rem' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
