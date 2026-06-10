const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/auth.js');

// Apply protection middleware to all jobs routes
router.use(protect);

// @route   GET /api/jobs
// @desc    Get all jobs for logged in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Fetch Jobs Error:', error);
    return res.status(500).json({ success: false, error: 'Server error fetching jobs' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job entry
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { company, role, jobUrl, dateApplied, status, notes } = req.body;

    // Validate required fields
    if (!company || !role) {
      return res.status(400).json({ success: false, error: 'Please provide company and role' });
    }

    const job = await Job.create({
      userId: req.user.id,
      company,
      role,
      jobUrl: jobUrl || '',
      dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
      status: status || 'Applied',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Create Job Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    return res.status(500).json({ success: false, error: 'Server error creating job application' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job entry
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { company, role, jobUrl, dateApplied, status, notes } = req.body;

    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job application not found' });
    }

    // Make sure user owns the job entry
    if (job.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this entry' });
    }

    // Fields to update
    const updateFields = {};
    if (company !== undefined) updateFields.company = company;
    if (role !== undefined) updateFields.role = role;
    if (jobUrl !== undefined) updateFields.jobUrl = jobUrl;
    if (dateApplied !== undefined) updateFields.dateApplied = new Date(dateApplied);
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Update Job Error:', error);
    return res.status(500).json({ success: false, error: 'Server error updating job application' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job entry
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job application not found' });
    }

    // Make sure user owns the job entry
    if (job.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this entry' });
    }

    await Job.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete Job Error:', error);
    return res.status(500).json({ success: false, error: 'Server error deleting job application' });
  }
});

module.exports = router;
