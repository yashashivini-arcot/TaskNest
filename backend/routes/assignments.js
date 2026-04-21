const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, assignmentController.getAssignments);
router.post('/', auth, authorize('faculty'), assignmentController.createAssignment);
router.put('/:id', auth, authorize('faculty'), assignmentController.updateAssignment);
router.delete('/:id', auth, authorize('faculty'), assignmentController.deleteAssignment);

module.exports = router;
