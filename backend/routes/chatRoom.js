// routes/chatroom.js
const express = require('express');
const router = express.Router();
const checkJWT = require('../middleware/checkJWT');
const LostandFound = require('../models/LostandFound');
const upload = require('../middleware/multer'); // <-- Import multer
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (it will automatically use the .env variables)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Helper function to upload from buffer
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'laundry-app' }, // Optional: organize in a folder
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// @route   POST /tickets
// @desc    Create a new Lost or Found ticket (NOW WITH IMAGE)
// @access  Private
// 'image' must match the FormData key from the frontend
router.post('/tickets', checkJWT, upload.single('image'), async (req, res) => {
  const { type, description } = req.body;
  const { id, name, roomNumber } = req.user;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }
    if (!description || !type) {
      return res.status(400).json({ message: 'Type and description are required.' });
    }

    // 1. Upload the image to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    
    // 2. Create the new ticket
    const newTicket = new LostandFound({
      type,
      description,
      user: id,
      userName: name,
      roomId: roomNumber,
      imageUrl: uploadResult.secure_url, // <-- Save the URL
      publicId: uploadResult.public_id  // <-- Save the ID for deletion
    });

    await newTicket.save();
    res.status(201).json(newTicket);

  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /tickets
// @desc    Get all 'Open' tickets
// @access  Private
router.get('/tickets', checkJWT, async (req, res) => {
  try {
    const tickets = await LostandFound.find({ status: 'Open' })
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /tickets/:id/resolve
// @desc    Mark a ticket as 'Resolved'
// @access  Private
router.put('/tickets/:id/resolve', checkJWT, async (req, res) => {
  try {
    let ticket = await LostandFound.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // We don't delete the image, just mark as resolved.
    // You could delete from Cloudinary here if you want:
    // await cloudinary.uploader.destroy(ticket.publicId);
    
    ticket.status = 'Resolved';
    await ticket.save();
    
    res.json(ticket);
  } catch (err)
 {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;