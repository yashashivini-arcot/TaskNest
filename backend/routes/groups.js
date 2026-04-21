const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const groupController = require('../controllers/groupController');

router.get('/', auth, groupController.getGroups);
router.post('/', auth, groupController.createGroup);
router.post('/:id/add-member', auth, groupController.addMember);

module.exports = router;
