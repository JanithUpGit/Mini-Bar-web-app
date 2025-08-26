// backend/controllers/productController.js

const Product = require("../models/Product");

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


exports.createProduct = (req, res) => {
  const {
    product_name,
    price,
    description,
    stock_quantity,
    category_id,
    is_available,
  } = req.body;

  Product.getByName(product_name, (err, existingProduct) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed." });
    }

    // Product එකක් දැනටමත් තිබේ නම්, error එකක් යවනවා
    if (existingProduct) {
      return res.status(409).json({ error: "Product name already exists." });
    }

    // Product එකක් නැතිනම්, අලුත් Product එකක් create කරනවා
    const newProduct = {
      product_name,
      price,
      description,
      stock_quantity,
      category_id,
      is_available: is_available !== undefined ? is_available : true,
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

// Get a product by ID
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

// Update a product by ID
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const {
    product_name,
    price,
    description,
    stock_quantity,
    category_id,
    is_available,
  } = req.body;
  const updatedProduct = {
    product_name,
    price,
    description,
    stock_quantity,
    category_id,
    is_available,
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
