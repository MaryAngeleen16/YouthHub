
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create a new category
router.post('/categories/new', categoryController.createCategory);

// Get all categories
router.get('/categories', categoryController.getAllCategories);

// Get a category by ID
router.get('/categories/:id', categoryController.getCategoryById);

// Update a category by ID
router.put('/categories/:id', categoryController.updateCategory);

// Delete a category by ID
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;