const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Job = require('../models/Job');

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecurejobtrackersecretkey9977!', {
    expiresIn: '30d'
  });
};

// Seed 3 sample jobs helper
const seedSampleJobs = async (userId) => {
  try {
    const sampleJobs = [
      {
        userId,
        company: 'Google',
        role: 'Software Engineer',
        jobUrl: 'https://careers.google.com',
        dateApplied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        status: 'Applied',
        notes: 'Applied via referral from former colleague. Standard application submitted.'
      },
      {
        userId,
        company: 'Meta',
        role: 'Frontend Developer',
        jobUrl: 'https://metacareers.com',
        dateApplied: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        status: 'Interview',
        notes: 'First round technical screen scheduled! Reviewing React hooks, performance, and general JavaScript fundamentals.'
      },
      {
        userId,
        company: 'Netflix',
        role: 'Full Stack Engineer',
        jobUrl: 'https://jobs.netflix.com',
        dateApplied: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        status: 'Offer',
        notes: 'Received an official offer! Compensation review is in progress. Super excited about the team and culture!'
      }
    ];

    await Job.insertMany(sampleJobs);
    console.log(`Successfully seeded 3 demo jobs for user ${userId}`);
  } catch (error) {
    console.error('Error seeding demo jobs:', error);
  }
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    // Seed sample jobs for demonstration
    await seedSampleJobs(user._id);

    return res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Check for user (include password in selection explicitly)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Check if user has jobs; if not, seed 3 sample jobs for demo
    const jobCount = await Job.countDocuments({ userId: user._id });
    if (jobCount === 0) {
      await seedSampleJobs(user._id);
    }

    return res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

module.exports = router;
