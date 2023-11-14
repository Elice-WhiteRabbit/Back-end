const express = require('express');
const router = express.Router();
const { postController } = require('../controllers/postController');

router.get('/', postController.getAllPost);
router.post('/', postController.addPost);
router.patch('/:id', postController.setPost);
router.delete('/:id', postController.deletePost);
router.get('/:author', postController.getPostByAuthor);
router.get('/categories/:category', postController.getPostByCategory);

module.exports = router;