const express = require('express');
const router = express.Router();
const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  scheduleInterview,
  getDashboardSummary, // Import the new controller function
  uploadResume
} = require('../controllers/candidateController');
const upload = require('../middleware/upload');

// --- NEW DASHBOARD ROUTE ---
// IMPORTANT: This must come BEFORE the '/:id' route
// Otherwise, 'summary' will be treated as an ID.
router.route('/dashboard/summary')
  .get(getDashboardSummary);

router.post('/upload-resume', upload.single('resume'), uploadResume);

router.route('/')
  .post(createCandidate)
  .get(getAllCandidates);

router.route('/:id')
  .get(getCandidateById)
  .put(updateCandidate);
  
router.route('/:id/schedule')
  .post(scheduleInterview);

module.exports = router;