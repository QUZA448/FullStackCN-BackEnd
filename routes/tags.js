const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

router.get('/', tagController.getAllTags);
router.post('/', tagController.createTag);
router.get('/:name/questions', tagController.getTagByName);
router.put('/:id', tagController.updateTag);

module.exports = router;
