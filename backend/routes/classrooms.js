const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, classroomController.getAllClassrooms);
router.post('/', auth, authorize('faculty'), classroomController.createClassroom);
router.delete('/:id', auth, authorize('faculty'), classroomController.deleteClassroom);
router.post('/:id/add-student', auth, authorize('faculty'), classroomController.addStudent);
router.delete('/:id/remove-student/:userId', auth, authorize('faculty'), classroomController.removeStudent);
router.get('/:id/members', auth, classroomController.getClassroomMembers);

module.exports = router;
