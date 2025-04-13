const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { UserID: user.UserID, Role: user.Role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

const register = async (req, res) => {
  try {
    const { Name, Email, Password, Role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      Name,
      Email,
      Password,
      Role
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        UserID: user.UserID,
        Name: user.Name,
        Email: user.Email,
        Role: user.Role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Find user
    const user = await User.findOne({ where: { Email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(Password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        UserID: user.UserID,
        Name: user.Name,
        Email: user.Email,
        Role: user.Role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { register, login }; 