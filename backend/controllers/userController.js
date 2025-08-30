const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { user_name, email, password, user_status, user_role } = req.body;
    if (!user_name || !email || !password || !user_role) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = {
      user_name,
      email,
      password_hash,
      user_status: user_status || 'ACTIVE',
      user_role
    };

    const result = await User.create(newUser);
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await User.getById(id);
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Failed to retrieve user.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    const result = await User.update(id, updatedUser);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.delete(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const user = await User.getByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

    // Set session
    req.session.user = {
      user_id: user.user_id,
      user_role: user.user_role,
      user_name: user.user_name,
      user_email: user.email
    };

    res.status(200).json({ message: 'Login successful', user: { id: user.user_id, role: user.user_role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login.' });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) throw err;
      res.status(200).json({ message: 'Logout successful' });
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Failed to log out.' });
  }
};

exports.profile = async (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

exports.searchUsersByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'Name query parameter is required.' });
    }

    const users = await User.getByName(name);
    res.json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
};
