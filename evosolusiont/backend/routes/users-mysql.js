const express = require('express');
const { getPool } = require('../database');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  console.log('📋 GET /api/users - Received request');
  try {
    const pool = getPool();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    // Role filter
    if (req.query.role) {
      whereClause += ' WHERE role = ?';
      params.push(req.query.role);
    }

    // Status filter
    if (req.query.status) {
      const statusCondition = req.query.status === 'active' ? 'isActive = 1' : 'isActive = 0';
      whereClause += whereClause ? ` AND ${statusCondition}` : ` WHERE ${statusCondition}`;
    }

    // Search filter
    if (req.query.search) {
      const searchCondition = `(firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)`;
      whereClause += whereClause ? ` AND ${searchCondition}` : ` WHERE ${searchCondition}`;
      const searchTerm = `%${req.query.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get users with pagination
    const query = `SELECT id, email, firstName, lastName, role, phone, address, company, isActive, createdAt, updatedAt 
                   FROM users ${whereClause} 
                   ORDER BY createdAt DESC 
                   LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    
    const [users] = await pool.execute(query, params);

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          address: user.address,
          company: user.company,
          isActive: user.isActive,
          status: user.isActive ? 'active' : 'inactive',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while fetching users'
    });
  }
});

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Admin only)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    const { firstName, lastName, email, phone, role, password, address, company } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'firstName, lastName, email, password, and role are required'
      });
    }

    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be either admin or user'
      });
    }

    // Check if email already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        error: 'Email already exists',
        message: 'A user with this email already exists'
      });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (firstName, lastName, email, password, role, phone, address, company, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, role, phone || null, address || null, company || null, 1]
    );

    const newUserId = result.insertId;

    // Get the created user
    const [newUsers] = await pool.execute(
      'SELECT id, email, firstName, lastName, role, phone, address, company, isActive, createdAt, updatedAt FROM users WHERE id = ?',
      [newUserId]
    );

    const newUser = newUsers[0];

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: `${newUser.firstName} ${newUser.lastName}`,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          phone: newUser.phone,
          address: newUser.address,
          company: newUser.company,
          status: newUser.isActive ? 'active' : 'inactive',
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while creating user'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'User ID must be a number'
      });
    }

    const [users] = await pool.execute(
      'SELECT id, email, firstName, lastName, role, phone, address, company, isActive, createdAt, updatedAt FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    const user = users[0];

    // Check if user can access this profile
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own profile'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          address: user.address,
          company: user.company,
          isActive: user.isActive,
          status: user.isActive ? 'active' : 'inactive',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while fetching user'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'User ID must be a number'
      });
    }

    const { firstName, lastName, phone, address, company, role, password } = req.body;

    // Check if user can update this profile
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own profile'
      });
    }

    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    // Update user fields
    const updateFields = [];
    const updateValues = [];

    if (firstName) {
      updateFields.push('firstName = ?');
      updateValues.push(firstName);
    }
    if (lastName) {
      updateFields.push('lastName = ?');
      updateValues.push(lastName);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (address) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (company) {
      updateFields.push('company = ?');
      updateValues.push(company);
    }
    
    // Only admin can change role
    if (role && req.user.role === 'admin') {
      if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({
          error: 'Invalid role',
          message: 'Role must be either admin or user'
        });
      }
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    
    // Only admin can change password
    if (password && req.user.role === 'admin') {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 12);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No updates',
        message: 'No fields to update'
      });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(userId);

    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated user
    const [updatedUsers] = await pool.execute(
      'SELECT id, email, firstName, lastName, role, phone, address, company, isActive, createdAt, updatedAt FROM users WHERE id = ?',
      [userId]
    );

    const user = updatedUsers[0];

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          address: user.address,
          company: user.company,
          isActive: user.isActive,
          status: user.isActive ? 'active' : 'inactive',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while updating user'
    });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status
// @access  Private (Admin only)
router.put('/:id/status', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'User ID must be a number'
      });
    }

    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be either active or inactive'
      });
    }

    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (req.user.id === userId && status === 'inactive') {
      return res.status(400).json({
        error: 'Invalid operation',
        message: 'You cannot deactivate your own account'
      });
    }

    const isActive = status === 'active' ? 1 : 0;

    await pool.execute(
      'UPDATE users SET isActive = ?, updatedAt = NOW() WHERE id = ?',
      [isActive, userId]
    );

    // Get updated user
    const [updatedUsers] = await pool.execute(
      'SELECT id, email, firstName, lastName, role, phone, address, company, isActive, createdAt, updatedAt FROM users WHERE id = ?',
      [userId]
    );

    const user = updatedUsers[0];

    res.json({
      success: true,
      message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          address: user.address,
          company: user.company,
          isActive: user.isActive,
          status: user.isActive ? 'active' : 'inactive',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while updating user status'
    });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics
// @access  Private (Admin only)
router.get('/stats/overview', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    
    // Get total users
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM users');
    const totalUsers = totalResult[0].total;

    // Get active users
    const [activeResult] = await pool.execute('SELECT COUNT(*) as total FROM users WHERE isActive = 1');
    const activeUsers = activeResult[0].total;

    // Get users by role
    const [roleResult] = await pool.execute(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );

    const usersByRole = roleResult.reduce((acc, row) => {
      acc[row.role] = row.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByRole
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while fetching user statistics'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Super Admin only)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'User ID must be a number'
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === userId) {
      return res.status(400).json({
        error: 'Invalid operation',
        message: 'You cannot delete your own account'
      });
    }

    const [users] = await pool.execute(
      'SELECT id, firstName, lastName FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    const user = users[0];

    // Delete user
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: `User ${user.firstName} ${user.lastName} deleted successfully`
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while deleting user'
    });
  }
});

module.exports = router;
