const Product = require("../models/Product");

// සියලුම නිෂ්පාදන ලබාගන්න
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to retrieve products." });
  }
};

// ලබා ගත හැකි නිෂ්පාදන පමණක්
exports.getAvailableProducts = async (req, res) => {
  try {
    const products = await Product.getAllAvailable();
    res.json(products);
  } catch (err) {
    console.error("Error fetching available products:", err);
    res.status(500).json({ error: 'Failed to retrieve available products.' });
  }
};

// නව නිෂ්පාදනයක් සාදන්න
exports.createProduct = async (req, res) => {
  try {
    const { product_name, price, description, stock_quantity, category_id, is_available, image_url } = req.body;

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

    const createdProduct = await Product.create(newProduct);
    res.status(201).json({ message: "Product created successfully", product: createdProduct });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product." });
  }
};

// ID අනුව නිෂ්පාදනයක් ලබාගන්න
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Failed to retrieve product." });
  }
};

// ID අනුව නිෂ්පාදනයක් යාවත්කාලීන කරන්න
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, price, description, stock_quantity, category_id, is_available, image_url } = req.body;

    const updatedProduct = { product_name, price, description, stock_quantity, category_id, is_available, image_url };
    const product = await Product.update(id, updatedProduct);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product." });
  }
};

// තොග ප්‍රමාණය යාවත්කාලීන කරන්න
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    if (stock_quantity === undefined) {
      return res.status(400).json({ error: "Stock quantity is required." });
    }

    const product = await Product.updateStock(id, stock_quantity);
    if (!product) {
      return res.status(404).json({ error: "Product not found or no change in stock." });
    }

    res.json({ message: "Stock updated successfully.", product });
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ error: "Failed to update stock." });
  }
};

// ලබා ගත හැකි බව (availability) යාවත්කාලීන කරන්න
exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    if (is_available === undefined) {
      return res.status(400).json({ error: "Availability status is required." });
    }

    const product = await Product.updateAvailability(id, is_available);
    if (!product) {
      return res.status(404).json({ error: "Product not found or no change in availability." });
    }

    res.json({ message: "Availability updated successfully.", product });
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ error: "Failed to update availability." });
  }
};

// ID අනුව නිෂ්පාදනයක් මකා දමන්න
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.delete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ message: "Product deleted successfully.", product });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product." });
  }
};
