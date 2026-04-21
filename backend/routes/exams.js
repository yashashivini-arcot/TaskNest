const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, examController.getExams);
router.post('/', auth, authorize('faculty'), examController.addExam);
router.put('/:id', auth, authorize('faculty'), examController.updateExam);
router.delete('/:id', auth, authorize('faculty'), examController.deleteExam);

module.exports = router;
