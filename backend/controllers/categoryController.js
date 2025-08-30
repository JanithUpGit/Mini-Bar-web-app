const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
};

exports.createCategory = async (req, res) => {
  const { category_name, image_url } = req.body;

  if (!category_name || !image_url) {
    return res.status(400).json({ error: 'Category name and image URL are required.' });
  }

  try {
    const categoryId = await Category.create({ category_name, image_url });
    res.status(201).json({ message: 'Category created successfully', categoryId });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: 'Failed to create category.' });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
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

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name, image_url } = req.body;

  if (!category_name || !image_url) {
    return res.status(400).json({ error: 'Category name and image URL are required for an update.' });
  }

  try {
    const affectedRows = await Category.update(id, { category_name, image_url });
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: 'Failed to update category.' });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const affectedRows = await Category.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
};
