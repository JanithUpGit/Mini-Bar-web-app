// backend/controllers/categoryController.js

const Category = require('../models/Category');

exports.getCategories = (req, res) => {
  Category.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
    res.json(results);
  });
};

exports.createCategory = (req, res) => {
  const { category_name } = req.body;
  
  if (!category_name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  const newCategory = { category_name };

  Category.create(newCategory, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create category.' });
    }
    res.status(201).json({ message: 'Category created successfully', categoryId: result.insertId });
  });
};

// Get a category by ID
exports.getCategoryById = (req, res) => {
  const { id } = req.params;
  Category.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve category.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json(results[0]);
  });
};

// Update a category by ID
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;
  const updatedCategory = { category_name };

  Category.update(id, updatedCategory, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update category.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ message: 'Category updated successfully' });
  });
};

// Delete a category by ID
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  Category.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete category.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ message: 'Category deleted successfully' });
  });
};