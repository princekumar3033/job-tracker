import React, { useState } from 'react';

const COLUMNS = ['Applied', 'Interview', 'Offer', 'Rejected'];

const KanbanBoard = ({ jobs, onEdit, onDelete, onStatusChange }) => {
  const [activeDragCol, setActiveDragCol] = useState(null);

  // Drag and Drop triggers
  const handleDragStart = (e, jobId) => {
    e.dataTransfer.setData('text/plain', jobId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colName) => {
    e.preventDefault();
    setActiveDragCol(colName);
  };

  const handleDragLeave = () => {
    setActiveDragCol(null);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setActiveDragCol(null);
    const jobId = e.dataTransfer.getData('text/plain');
    if (jobId) {
      onStatusChange(jobId, targetStatus);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="kanban-grid">
      {COLUMNS.map((colName) => {
        const colJobs = jobs.filter((j) => j.status === colName);
        const isDraggingOver = activeDragCol === colName;

        return (
          <div
            key={colName}
            className="kanban-column"
            onDragOver={(e) => handleDragOver(e, colName)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, colName)}
          >
            <div className="kanban-col-header">
              <h3 className="kanban-col-title">
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: `var(--status-${colName.toLowerCase()})`,
                    boxShadow: `0 0 6px var(--status-${colName.toLowerCase()})`
                  }}
                ></span>
                {colName}
              </h3>
              <span className="kanban-col-count">{colJobs.length}</span>
            </div>

            <div className={`kanban-cards-wrapper ${isDraggingOver ? 'dragover' : ''}`}>
              {colJobs.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100px',
                    color: '#555066',
                    fontSize: '0.85rem',
                    border: '1px dashed rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '1rem'
                  }}
                >
                  Drop jobs here
                </div>
              ) : (
                colJobs.map((job) => (
                  <div
                    key={job._id}
                    className={`job-card card-${job.status}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, job._id)}
                  >
                    <div className="job-card-header">
                      <h4 className="job-card-company">{job.company}</h4>
                      {/* Mobile / Screenreader fallback selector to change status */}
                      <select
                        className="move-card-select"
                        value={job.status}
                        onChange={(e) => onStatusChange(job._id, e.target.value)}
                        title="Move to column"
                      >
                        {COLUMNS.map((col) => (
                          <option key={col} value={col}>
                            → {col}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="job-card-role">{job.role}</div>
                    
                    <div className="job-card-date">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {formatDate(job.dateApplied)}
                    </div>

                    {job.notes && <div className="job-card-notes">{job.notes}</div>}

                    <div className="job-card-actions">
                      {job.jobUrl ? (
                        <a
                          href={job.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="job-card-link"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                          View Post
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#555066' }}>No URL</span>
                      )}

                      <div className="job-card-buttons">
                        <button
                          className="icon-btn icon-btn-edit"
                          onClick={() => onEdit(job)}
                          title="Edit Job"
                          aria-label="Edit job details"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="icon-btn icon-btn-delete"
                          onClick={() => onDelete(job._id)}
                          title="Delete Job"
                          aria-label="Delete job application"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
