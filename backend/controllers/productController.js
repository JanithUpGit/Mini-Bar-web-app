const Product = require("../models/Product");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to retrieve products." });
  }
};

// Get all available products
exports.getAvailableProducts = async (req, res) => {
  try {
    const products = await Product.getAllAvailable();
    res.json(products);
  } catch (err) {
    console.error("Error fetching available products:", err);
    res.status(500).json({ error: 'Failed to retrieve available products.' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
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

    const existingProduct = await Product.getByName(product_name);
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

    const result = await Product.create(newProduct);
    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product." });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await Product.getById(id);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(results[0]);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Failed to retrieve product." });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;

    const result = await Product.update(id, updatedProduct);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product." });
  }
};

// Update stock quantity
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;
    if (stock_quantity === undefined) {
      return res.status(400).json({ error: "Stock quantity is required." });
    }

    const result = await Product.updateStock(id, stock_quantity);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found or no change in stock." });
    }
    res.json({ message: "Stock updated successfully." });
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ error: "Failed to update stock." });
  }
};

// Update availability
exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;
    if (is_available === undefined) {
      return res.status(400).json({ error: "Availability status is required." });
    }

    const result = await Product.updateAvailability(id, is_available);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found or no change in availability." });
    }
    res.json({ message: "Availability updated successfully." });
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ error: "Failed to update availability." });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.delete(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product." });
  }
};
