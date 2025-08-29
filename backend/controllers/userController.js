// backend/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve users.' });
    }
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  const { user_name, email, password, user_status, user_role } = req.body;
  
  if (!user_name || !email || !password || !user_role) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to hash password.' });
    }
    const newUser = {
      user_name,
      email,
      password_hash: hash,
      user_status: user_status || 'ACTIVE',
      user_role
    };

    User.create(newUser, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create user.' });
      }
      res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    });
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve user.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(results[0]);
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { user_name, email, user_status, user_role } = req.body;
  const updatedUser = { user_name, email, user_status, user_role };

  User.update(id, updatedUser, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update user.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User updated successfully' });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  User.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete user.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully' });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  User.getByEmail(email, (err, user) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Failed to retrieve user.' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Password comparison failed.' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Login සාර්ථකයි, user ගේ තොරතුරු session එකට එකතු කරයි
      req.session.user = { 
        user_id: user.user_id, 
        user_role: user.user_role ,
        user_name: user.user_name,
        user_email:user.email
      };

      res.status(200).json({ message: 'Login successful', user: { id: user.user_id, role: user.user_role } });
    });
  });
};


exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out.' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
};

exports.profile = (req, res) => {
  
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

