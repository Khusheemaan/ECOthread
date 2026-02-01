import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerUser, authenticateUser, updateUserProfile } from './services/userService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, firstName, lastName, phone, dob } = req.body;

    const user = await registerUser(email, password, {
      name,
      firstName,
      lastName,
      phone,
      dob
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dob: user.dob
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          dob: user.dob,
          username: user.username,
          stylePreferences: user.stylePreferences
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// User profile routes
app.put('/api/user/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profileUpdates = req.body;

    const updatedUser = await updateUserProfile(userId, profileUpdates);

    if (updatedUser) {
      res.json({
        success: true,
        user: {
          id: updatedUser._id.toString(),
          email: updatedUser.email,
          name: updatedUser.name,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          dob: updatedUser.dob,
          username: updatedUser.username,
          stylePreferences: updatedUser.stylePreferences
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile update failed'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
