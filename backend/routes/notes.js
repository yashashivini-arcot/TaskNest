const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { auth, authorize } = require('../middleware/auth');

router.get('/:classroomId', auth, noteController.getNotesByClassroom);
router.post('/', auth, authorize('faculty'), noteController.uploadNote);
router.put('/:id', auth, authorize('faculty'), noteController.updateNote);
router.delete('/:id', auth, authorize('faculty'), noteController.deleteNote);

module.exports = router;
