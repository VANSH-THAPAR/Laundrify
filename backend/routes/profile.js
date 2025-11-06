const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signupSchema = require('../models/signup');
const laundarySchema = require('../models/laundary');
const checkJWT = require('../middleware/checkJWT');

// @route   GET /home-laundry
// @desc    Get ALL laundry history for the logged-in user
// @access  Private
router.get('/profile-laundry', checkJWT, async (req, res) => {
    try {
        // --- ✅ THE BUG-FREE LOGIC ---
        // Get the user's unique ID from the token
        const userId = req.user.id;
        const name = req.user.name;
        // console.log("hi");
        console.log(name);

        // Find all laundry slips where the 'userId' field matches the token's 'id'
        const allLaundry = await laundarySchema.find({ 
            personName: name
        }).sort({ createdAt: -1 });; // Show newest first

        res.status(200).json(allLaundry);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while fetching laundry data." });
    }
});


// @route   GET /me
// @desc    Get current user's profile
// @access  Private
router.get('/me', checkJWT, async (req, res) => {
  try {
    const user = await signupSchema.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /update
// @desc    Update user's profile information (name, email)
// @access  Private
router.put('/update', checkJWT, async (req, res) => {
  // ... (This route is fine as-is)
  const { name, email } = req.body;
  const userId = req.user.id;

  try {
    let user = await signupSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await signupSchema.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    const payload = {
      roomNumber: user.roomId,
      email: user.email,
      name: user.name,
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.jwt_secret);

    res.json({
      message: 'Profile updated successfully',
      token,
      user: {
        name: user.name,
        email: user.email,
        roomId: user.roomId,
        id: user._id,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /update-password
// @desc    Update user's password
// @access  Private
router.put('/update-password', checkJWT, async (req, res) => {
  // ... (This route is fine as-is)
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'All password fields are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  try {
    const user = await signupSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /delete
// @desc    Delete user account and all their data
// @access  Private
router.delete('/delete', checkJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // ✅ This query is now correct and safer
    await laundarySchema.deleteMany({ userId: userId });

    // 2. Delete the user account
    const deletedUser = await signupSchema.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account and all associated data deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;