const express = require('express');
const voteController = require('../controllers/voteController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, voteController.vote);
router.get('/', authMiddleware, voteController.getVote);

module.exports = router;
