const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { auth, authorize } = require('../middleware/auth');

// GET all submissions (faculty = all, student = own)
router.get('/', auth, submissionController.getSubmissions);

// GET submissions for a specific assignment (faculty only)
router.get('/assignment/:assignmentId', auth, authorize('faculty'), submissionController.getSubmissionsByAssignment);

// POST submit an assignment (student only)
router.post('/', auth, authorize('student'), submissionController.submitAssignment);

// PUT grade/evaluate a submission (faculty only)
router.put('/evaluate/:id', auth, authorize('faculty'), submissionController.gradeSubmission);

module.exports = router;
