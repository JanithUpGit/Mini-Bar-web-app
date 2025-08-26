// backend/controllers/productController.js

const Product = require('../models/Product');

// Get all products
exports.getProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve products.' });
    }
    res.json(results);
  });
};

// Create a new product
exports.createProduct = (req, res) => {
  const { product_name, price, description, stock_quantity, category_id, is_available } = req.body;
  
  if (!product_name || !price || !stock_quantity || !category_id) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const newProduct = {
    product_name,
    price,
    description,
    stock_quantity,
    category_id,
    is_available: is_available !== undefined ? is_available : true 
  };

  Product.create(newProduct, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create product.' });
    }
    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  });
};

// Get a product by ID
exports.getProductById = (req, res) => {
  const { id } = req.params;
  Product.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve product.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(results[0]);
  });
};

// Update a product by ID
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { product_name, price, description, stock_quantity, category_id, is_available } = req.body;
  const updatedProduct = { product_name, price, description, stock_quantity, category_id, is_available };

  Product.update(id, updatedProduct, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update product.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ message: 'Product updated successfully' });
  });
};

// Delete a product by ID
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  Product.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete product.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
};