const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/top', userController.getTopUsers);
router.get('/:id', userController.getUserProfile);
router.put('/:id', authMiddleware, userController.updateUserProfile);
router.get('/:id/questions', userController.getUserQuestions);
router.get('/:id/answers', userController.getUserAnswers);

module.exports = router;
