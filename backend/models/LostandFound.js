// models/LostAndFound.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  // Link to the user who posted it
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'signupModel', // Use the name of your user model
    required: true
  },
  // Store these for easy display
  userName: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    required: true
  },
  // 'Lost' or 'Found'
  type: {
    type: String,
    enum: ['Lost', 'Found'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxLength: 300
  },
  // 'Open' or 'Resolved'
  status: {
    type: String,
    enum: ['Open', 'Resolved'],
    default: 'Open'
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const LostandFound = mongoose.model('LostandFound', ticketSchema);
module.exports = LostandFound;