// routes/chatroom.js
const express = require('express');
const router = express.Router();
const checkJWT = require('../middleware/checkJWT');
const LostandFound = require('../models/LostandFound');

// @route   POST /api/tickets
// @desc    Create a new Lost or Found ticket
// @access  Private
router.post('/tickets', checkJWT, async (req, res) => {
  const { type, description } = req.body;
  const { id, name, roomNumber } = req.user;

  try {
    if (!description || !type) {
      return res.status(400).json({ message: 'Type and description are required.' });
    }

    const newTicket = new LostandFound({
      type,
      description,
      user: id,
      userName: name,
      roomId: roomNumber
    });

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tickets
// @desc    Get all 'Open' tickets
// @access  Private
router.get('/tickets', checkJWT, async (req, res) => {
  try {
    // Show all open tickets, newest first
    const tickets = await LostandFound.find({ status: 'Open' })
      .sort({ createdAt: -1 });
      
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/tickets/:id/resolve
// @desc    Mark a ticket as 'Resolved'
// @access  Private
router.put('/tickets/:id/resolve', checkJWT, async (req, res) => {
  try {
    let ticket = await LostandFound.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Optional: Only allow the user who created it to resolve it
    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Only resolve if it's 'Open'
    if (ticket.status === 'Open') {
      ticket.status = 'Resolved';
      await ticket.save();
    }
    
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;