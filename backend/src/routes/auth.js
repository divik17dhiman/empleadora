const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

// GET all users (for admin purposes)
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        wallet_address: true,
        role: true,
        created_at: true
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        wallet_address: true,
        role: true,
        created_at: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET user by wallet address
router.get('/users/wallet/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { wallet_address: walletAddress },
      select: {
        id: true,
        email: true,
        wallet_address: true,
        role: true,
        created_at: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by wallet error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET users by role
router.get('/users/role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    
    const users = await prisma.user.findMany({
      where: { role: role.toLowerCase() },
      select: {
        id: true,
        email: true,
        wallet_address: true,
        role: true,
        created_at: true
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password, wallet_address, role } = req.body;

    // Validate required fields
    if (!email || !password || !wallet_address || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { wallet_address },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this wallet address or email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        wallet_address,
        role: role.toLowerCase()
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, wallet_address: user.wallet_address, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login user
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { wallet_address: email } // Allow login with wallet address too
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, wallet_address: user.wallet_address, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);

  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
