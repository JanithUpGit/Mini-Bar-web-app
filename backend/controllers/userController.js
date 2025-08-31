const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { user_name, email, password, user_status, user_role } = req.body;

  if (!user_name || !email || !password || !user_role) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = {
      user_name,
      email,
      password_hash: hash,
      user_status: user_status || 'ACTIVE',
      user_role
    };

    const createdUser = await User.create(newUser);
    res.status(201).json({ message: 'User created successfully', userId: createdUser.user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve user.' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { user_name, email, user_status, user_role } = req.body;
  const updatedUser = { user_name, email, user_status, user_role };

  try {
    const user = await User.update(id, updatedUser);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.delete(id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Please provide email and password.' });

  try {
    const user = await User.getByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

    req.session.user = { 
      user_id: user.user_id,
      user_role: user.user_role,
      user_name: user.user_name,
      user_email: user.email
    };

    res.status(200).json({ message: 'Login successful', user: { id: user.user_id, role: user.user_role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed.' });
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to log out.' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
};

// Get logged-in user's profile
exports.profile = (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

// Search users by name
exports.searchUsersByName = async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Name query parameter is required.' });

  try {
    const users = await User.getByName(name);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
};
