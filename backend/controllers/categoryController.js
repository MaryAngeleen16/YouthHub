const Category = require('../models/category');
const mongoose = require('mongoose');

exports.createCategory = async (req, res) => {
  console.log('Full Request:', req);
  try {
    // console.log('Request Body:', req.body);
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle validation errors, such as required fields or unique constraints
      res.status(400).json({ error: error.message });
    } else {
      // Handle other errors, such as database errors
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Unable to create category' });
    }
  }
};


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({categories});
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve categories' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id; // Extract the ID from the URL parameters
    console.log('Requested category ID:', categoryId); // Log the requested ID

    // Use the retrieved category
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete category' });
  }
};