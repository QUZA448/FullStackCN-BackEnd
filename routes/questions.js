const express = require('express');
const questionController = require('../controllers/questionController');
const answerController = require('../controllers/answerController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', questionController.getAllQuestions);
router.post('/', authMiddleware, questionController.createQuestion);
router.get('/:id', questionController.getQuestionById);
router.put('/:id', authMiddleware, questionController.updateQuestion);
router.delete('/:id', authMiddleware, questionController.deleteQuestion);
router.get('/search', questionController.searchQuestions);

// Answers routes
router.post('/:questionId/answers', authMiddleware, answerController.createAnswer);

module.exports = router;
