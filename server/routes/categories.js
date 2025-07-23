const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/categories
router.get('/', categoriesController.getAllCategories);

// @route   POST /api/categories
router.post(
  '/',
  authMiddleware,
  [
    body('name').isString().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    validateRequest
  ],
  categoriesController.createCategory
);

module.exports = router; 