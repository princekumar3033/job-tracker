import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StatCards from '../components/StatCards';
import KanbanBoard from '../components/KanbanBoard';
import JobTable from '../components/JobTable';
import AddJobModal from '../components/AddJobModal';

const Dashboard = () => {
  const { user, logout, authFetch } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await authFetch('/jobs');
      if (res.success) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not fetch jobs from server.');
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Update Status of a Job (e.g. from Drag & Drop)
  const handleStatusChange = async (jobId, newStatus) => {
    // Optimistic UI update: instantly update local state so transitions feel fluid
    const originalJobs = [...jobs];
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
    );

    try {
      await authFetch(`/jobs/${jobId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update status on server:', err);
      setError('Failed to sync status update with server. Reverting...');
      // Revert state
      setJobs(originalJobs);
    }
  };

  // Add or Edit Job entry
  const handleSaveJob = async (jobData) => {
    try {
      setError('');
      if (selectedJob) {
        // Edit Mode
        const res = await authFetch(`/jobs/${selectedJob._id}`, {
          method: 'PUT',
          body: JSON.stringify(jobData)
        });
        if (res.success) {
          setJobs((prevJobs) =>
            prevJobs.map((j) => (j._id === selectedJob._id ? res.data : j))
          );
        }
      } else {
        // Add Mode
        const res = await authFetch('/jobs', {
          method: 'POST',
          body: JSON.stringify(jobData)
        });
        if (res.success) {
          setJobs((prevJobs) => [res.data, ...prevJobs]);
        }
      }
      setIsModalOpen(false);
      setSelectedJob(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save job application.');
    }
  };

  // Delete Job entry
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) {
      return;
    }

    try {
      setError('');
      const res = await authFetch(`/jobs/${jobId}`, {
        method: 'DELETE'
      });
      if (res.success) {
        setJobs((prevJobs) => prevJobs.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete job entry.');
    }
  };

  const handleOpenAddModal = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Filter jobs based on selected filter
  const filteredJobs =
    statusFilter === 'All' ? jobs : jobs.filter((j) => j.status === statusFilter);

  return (
    <div className="app-container">
      {/* Upper Navigation / Profile header */}
      <header className="dashboard-header">
        <div className="dashboard-title-wrapper">
          <h1>Dashboard</h1>
          <p>Welcome back to your workspace, keep crushing those goals!</p>
        </div>

        <div className="user-profile-menu">
          <div className="user-welcome">
            Hi, <strong>{user?.name || 'Candidate'}</strong>
          </div>
          <button className="btn btn-secondary" onClick={logout} title="Sign Out">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginRight: '4px', verticalAlign: 'middle' }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main error feedback alert */}
      {error && (
        <div className="auth-error" style={{ marginBottom: '2rem' }}>
          {error}
          <button
            onClick={() => setError('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              marginLeft: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* General Stats summary widgets */}
      <StatCards jobs={jobs} />

      {/* Controller Area (Add new job, Filter, and Toggle layout) */}
      <div className="controls-bar">
        <div className="filters-wrapper">
          <button
            className={`filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            All Jobs
          </button>
          <button
            className={`filter-btn ${statusFilter === 'Applied' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Applied')}
          >
            Applied
          </button>
          <button
            className={`filter-btn ${statusFilter === 'Interview' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Interview')}
          >
            Interviews
          </button>
          <button
            className={`filter-btn ${statusFilter === 'Offer' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Offer')}
          >
            Offers
          </button>
          <button
            className={`filter-btn ${statusFilter === 'Rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Rejected')}
          >
            Rejected
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View Toggles */}
          <div className="view-toggles">
            <button
              className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              aria-label="Kanban Board View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              Board
            </button>
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="List Table View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              List
            </button>
          </div>

          {/* Add Job Button */}
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Job
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {loadingJobs ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#b0aabf' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(157, 78, 221, 0.2)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              margin: '0 auto 1.5rem auto',
              animation: 'slideUp 1s infinite linear',
              transformOrigin: 'center'
            }}
          ></div>
          <p>Syncing your job applications workspace...</p>
        </div>
      ) : jobs.length === 0 ? (
        /* Empty State */
        <div className="empty-state glass-panel">
          <div className="empty-state-icon">💼</div>
          <h3>Your tracker board is empty</h3>
          <p>
            Start mapping your professional growth! Log your active submissions, track recruiter callbacks, and secure offers.
          </p>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            Log First Application
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          jobs={filteredJobs}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteJob}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <JobTable
          jobs={filteredJobs}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteJob}
        />
      )}

      {/* Add / Edit Job Form Modal */}
      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
        job={selectedJob}
      />
    </div>
  );
};

export default Dashboard;
