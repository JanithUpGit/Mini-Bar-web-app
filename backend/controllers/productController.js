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
    image_url,
  } = req.body;

  if (!product_name || !price || !category_id || !image_url) {
    return res.status(400).json({ error: "Product name, price, category ID, and image URL are required." });
  }

  Product.getByName(product_name, (err, existingProduct) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed." });
    }

    if (existingProduct) {
      return res.status(409).json({ error: "Product name already exists." });
    }

    const newProduct = {
      product_name,
      price,
      description,
      stock_quantity,
      category_id,
      is_available: is_available !== undefined ? is_available : true,
      image_url,
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
    image_url,
  } = req.body;
  
  const updatedProduct = {
    product_name,
    price,
    description,
    stock_quantity,
    category_id,
    is_available,
    image_url,
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

// තොග ප්‍රමාණය යාවත්කාලීන කිරීමට නව ශ්‍රිතය
exports.updateStock = (req, res) => {
  const { id } = req.params;
  const { stock_quantity } = req.body;
  if (stock_quantity === undefined) {
    return res.status(400).json({ error: "Stock quantity is required." });
  }

  Product.updateStock(id, stock_quantity, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update stock." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found or no change in stock." });
    }
    res.json({ message: "Stock updated successfully." });
  });
};

// ලබා ගත හැකි බව (availability) යාවත්කාලීන කිරීමට නව ශ්‍රිතය
exports.toggleAvailability = (req, res) => {
  const { id } = req.params;
  const { is_available } = req.body;
  if (is_available === undefined) {
    return res.status(400).json({ error: "Availability status is required." });
  }

  Product.updateAvailability(id, is_available, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update availability." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found or no change in availability." });
    }
    res.json({ message: "Availability updated successfully." });
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