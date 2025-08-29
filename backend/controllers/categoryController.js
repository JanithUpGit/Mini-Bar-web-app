// backend/controllers/categoryController.js

const Category = require('../models/Category');

exports.getCategories = (req, res) => {
  Category.getAll((err, results) => {
    if (err) {
      console.error("Error fetching categories:", err); // Log the error
      return res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
    res.json(results);
  });
};

exports.createCategory = (req, res) => {
  const { category_name, image_url } = req.body;

  if (!category_name || !image_url) { // Ensured both fields are required
    return res.status(400).json({ error: 'Category name and image URL are required.' });
  }

  const newCategory = { category_name, image_url }; // Passed both to the model

  Category.create(newCategory, (err, result) => {
    if (err) {
      console.error("Error creating category:", err); // Log the error
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
      console.error("Error fetching category by ID:", err); // Log the error
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
  const { category_name, image_url } = req.body;
  
  if (!category_name || !image_url) { // Ensured both fields are required for an update
    return res.status(400).json({ error: 'Category name and image URL are required for an update.' });
  }
  
  const updatedCategory = { category_name, image_url }; // Passed both to the model

  Category.update(id, updatedCategory, (err, result) => {
    if (err) {
      console.error("Error updating category:", err); // Log the error
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
      console.error("Error deleting category:", err); // Log the error
      return res.status(500).json({ error: 'Failed to delete category.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ message: 'Category deleted successfully' });
  });
};