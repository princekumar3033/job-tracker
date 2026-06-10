import React, { useState, useEffect } from 'react';

const AddJobModal = ({ isOpen, onClose, onSave, job }) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [dateApplied, setDateApplied] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Update form fields when job changes (for editing) or when modal opens
  useEffect(() => {
    if (job) {
      setCompany(job.company || '');
      setRole(job.role || '');
      setJobUrl(job.jobUrl || '');
      
      // Format date to YYYY-MM-DD for input field
      const dateVal = job.dateApplied ? new Date(job.dateApplied) : new Date();
      const formattedDate = dateVal.toISOString().split('T')[0];
      setDateApplied(formattedDate);
      
      setStatus(job.status || 'Applied');
      setNotes(job.notes || '');
    } else {
      // Clear fields for adding new job
      setCompany('');
      setRole('');
      setJobUrl('');
      setDateApplied(new Date().toISOString().split('T')[0]); // Today's date
      setStatus('Applied');
      setNotes('');
    }
    setError('');
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!company.trim() || !role.trim()) {
      setError('Company Name and Job Role are required.');
      return;
    }

    onSave({
      company: company.trim(),
      role: role.trim(),
      jobUrl: jobUrl.trim(),
      dateApplied: new Date(dateApplied).toISOString(),
      status,
      notes: notes.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{job ? 'Edit Job Entry' : 'Add Job Application'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="modal-company">
              Company Name *
            </label>
            <input
              id="modal-company"
              type="text"
              className="form-input"
              placeholder="e.g. Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-role">
              Job Role / Title *
            </label>
            <input
              id="modal-role"
              type="text"
              className="form-input"
              placeholder="e.g. Full Stack Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-url">
              Job Posting URL
            </label>
            <input
              id="modal-url"
              type="url"
              className="form-input"
              placeholder="e.g. https://careers.company.com/job"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="modal-date">
                Date Applied
              </label>
              <input
                id="modal-date"
                type="date"
                className="form-input"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-status">
                Status
              </label>
              <select
                id="modal-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-notes">
              Notes / Feedback
            </label>
            <textarea
              id="modal-notes"
              className="form-input"
              rows="3"
              placeholder="e.g. Referral from John, recruiter call on Monday..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {job ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
