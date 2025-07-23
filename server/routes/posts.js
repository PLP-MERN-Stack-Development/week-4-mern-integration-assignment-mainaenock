const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const postsController = require('../controllers/postsController');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');
const commentsRouter = require('./comments');

// @route   GET /api/posts
router.get('/', postsController.getAllPosts);

// @route   GET /api/posts/:id
router.get('/:id', postsController.getPostById);

// @route   POST /api/posts
router.post(
  '/',
  authMiddleware,
  [
    body('title').isString().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('content').isString().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
    body('category').isMongoId().withMessage('Category must be a valid ID'),
    validateRequest
  ],
  postsController.createPost
);

// @route   PUT /api/posts/:id
router.put(
  '/:id',
  authMiddleware,
  [
    body('title').optional().isString().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('content').optional().isString().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
    body('category').optional().isMongoId().withMessage('Category must be a valid ID'),
    validateRequest
  ],
  postsController.updatePost
);

// @route   DELETE /api/posts/:id
router.delete('/:id', authMiddleware, postsController.deletePost);

// Nested comments routes
router.use('/:id/comments', commentsRouter);

module.exports = router; 