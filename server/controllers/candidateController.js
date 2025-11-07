const Candidate = require('../models/Candidate');
const { simulateAIScore } = require('../utils/ai-screener');
const { sendInterviewEmail } = require('../utils/mock-mailer');

// Create a new candidate and run a simulated AI score
exports.createCandidate = async (req, res) => {
  try {
    const { name, email, jobTitle, resumeLink } = req.body;

    // Basic required fields
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Create the candidate record first (score will be updated after AI simulation)
    const candidate = new Candidate({ name, email, jobTitle, resumeLink });
    await candidate.save();

    // Simulate AI scoring asynchronously and update the saved document
    simulateAIScore(resumeLink)
      .then(async (score) => {
        candidate.score = score;
        await candidate.save();
      })
      .catch((err) => console.error('AI scoring failed:', err));

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error creating candidate', error: error.message });
  }
};

// Get all candidates (simple list)
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ appliedDate: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates', error: error.message });
  }
};

// Get a single candidate by id
exports.getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidate', error: error.message });
  }
};

// Update candidate details
exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const candidate = await Candidate.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error updating candidate', error: error.message });
  }
};

// Schedule an interview: accepts { interviewType, timeSlot } in body, emails candidate and updates status
exports.scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewType, timeSlot } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    const date = timeSlot ? new Date(timeSlot) : new Date();

    // Call the mock mailer (synchronous-ish console simulation)
    sendInterviewEmail(candidate.email, interviewType || 'Technical', date);

    // Update status to Interview and save
    candidate.status = 'Interview';
    await candidate.save();

    res.status(200).json({ message: 'Interview scheduled', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling interview', error: error.message });
  }
};

// @desc    Get dashboard summary metrics and charts
// @route   GET /api/dashboard/summary
exports.getDashboardSummary = async (req, res) => {
  try {
    // 1. Get counts for key metrics
    const totalCandidates = await Candidate.countDocuments();
    const interviewCandidates = await Candidate.countDocuments({ status: 'Interview' });
    const offerCandidates = await Candidate.countDocuments({ status: 'Offer' });

    // 2. Get Average AI Score
    const scoreAgg = await Candidate.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' }
        }
      }
    ]);
    const avgScore = scoreAgg[0] ? scoreAgg[0].avgScore : 0;

    // 3. Get counts for each status for the chart
    const statusCountsAgg = await Candidate.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } } // Sort by status name
    ]);

    // Format for chart.js
    const chartData = {
      labels: statusCountsAgg.map(item => item._id),
      data: statusCountsAgg.map(item => item.count),
    };

    // 4. Send the combined response
    res.status(200).json({
      totalCandidates,
      interviewCandidates,
      offerCandidates,
      avgScore: Math.round(avgScore * 10) / 10, // Round to 1 decimal
      chartData
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard summary', error: error.message });
  }
};

// Handle resume file upload and return a URL to the stored file
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const resumeUrl = `/uploads/${req.file.filename}`; // served statically from server
    res.status(200).json({ resumeUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading resume', error: error.message });
  }
};