// backend/controllers/categoryController.js

const Category = require('../models/Category');

// ✅ Get all categories
exports.getCategories = async (req, res) => {
  try {
    const results = await Category.getAll();
    res.json(results);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
};

// ✅ Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { category_name, image_url } = req.body;

    if (!category_name || !image_url) {
      return res.status(400).json({ error: 'Category name and image URL are required.' });
    }

    const newCategory = await Category.create({ category_name, image_url });
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: 'Failed to create category.' });
  }
};

// ✅ Get a category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json(category);
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    res.status(500).json({ error: 'Failed to retrieve category.' });
  }
};

// ✅ Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, image_url } = req.body;

    if (!category_name || !image_url) {
      return res.status(400).json({ error: 'Category name and image URL are required for an update.' });
    }

    const updatedCategory = await Category.update(id, { category_name, image_url });

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: 'Failed to update category.' });
  }
};

// ✅ Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.delete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
};
