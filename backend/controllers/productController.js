// backend/controllers/productController.js

const Product = require("../models/Product");

// සියලුම නිෂ්පාදන ලබාගන්න
exports.getProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve products." });
    }
    res.json(results);
  });
};

exports.getAvailableProducts = (req, res) => {
  Product.getAllAvailable((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve available products.' });
    }
    res.json(results);
  });
};

// නව නිෂ්පාදනයක් සාදන්න
exports.createProduct = (req, res) => {
  const {
    product_name,
    price,
    description,
    stock_quantity,
    category_id,
    is_available,
    image_url, // image_url එක මෙහිදී ලබා ගනී
  } = req.body;

  // අවම වශයෙන් අවශ්‍ය දත්ත තිබේදැයි පරීක්ෂා කරන්න
  if (!product_name || !price || !category_id || !image_url) {
    return res.status(400).json({ error: "Product name, price, category ID, and image URL are required." });
  }

  Product.getByName(product_name, (err, existingProduct) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed." });
    }

    // Product එකක් දැනටමත් තිබේ නම්, 409 Conflict error එකක් යවන්න
    if (existingProduct) {
      return res.status(409).json({ error: "Product name already exists." });
    }

    // Product එකක් නැතිනම්, අලුත් Product එකක් create කරන්න
    const newProduct = {
      product_name,
      price,
      description,
      stock_quantity,
      category_id,
      is_available: is_available !== undefined ? is_available : true,
      image_url, // image_url එක object එකට එකතු කරයි
    };

    Product.create(newProduct, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create product." });
      }
      res
        .status(201)
        .json({
          message: "Product created successfully",
          productId: result.insertId,
        });
    });
  });
};

// ID එක අනුව නිෂ්පාදනයක් ලබාගන්න
exports.getProductById = (req, res) => {
  const { id } = req.params;
  Product.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve product." });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(results[0]);
  });
};

// ID එක අනුව නිෂ්පාදනයක් යාවත්කාලීන කරන්න
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const {
    product_name,
    price,
    description,
    stock_quantity,
    category_id,
    is_available,
    image_url, // image_url එක මෙහිදී ලබා ගනී
  } = req.body;
  
  const updatedProduct = {
    product_name,
    price,
    description,
    stock_quantity,
    category_id,
    is_available,
    image_url, // image_url එක object එකට එකතු කරයි
  };

  Product.update(id, updatedProduct, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update product." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product updated successfully" });
  });
};

// ID එක අනුව නිෂ්පාදනයක් මකා දමන්න
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  Product.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete product." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted successfully" });
  });
};