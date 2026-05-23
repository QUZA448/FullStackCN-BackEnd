const express = require('express');
const answerController = require('../controllers/answerController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.put('/:id', authMiddleware, answerController.updateAnswer);
router.delete('/:id', authMiddleware, answerController.deleteAnswer);
router.patch('/:id/mark-best', authMiddleware, answerController.markBestAnswer);

module.exports = router;
