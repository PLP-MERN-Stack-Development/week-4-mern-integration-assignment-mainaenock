const express = require('express');
const { body } = require('express-validator');
const router = express.Router({ mergeParams: true });
const commentsController = require('../controllers/commentsController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

// @route   GET /api/posts/:id/comments
router.get('/', commentsController.getCommentsForPost);

// @route   POST /api/posts/:id/comments
router.post(
  '/',
  authMiddleware,
  [
    body('content').isString().isLength({ min: 1 }).withMessage('Comment cannot be empty'),
    validateRequest
  ],
  commentsController.addComment
);

module.exports = router; 