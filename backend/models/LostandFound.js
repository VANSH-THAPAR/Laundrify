// models/LostandFound.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'signupModel',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    required: true
  },
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
  // --- ✅ NEW FIELD ---
  imageUrl: {
    type: String,
    required: [true, 'Image is required.']
  },
  // --- ✅ NEW FIELD (for secure delete/resolve) ---
  publicId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Resolved'],
    default: 'Open'
  }
}, { timestamps: true });

const LostandFound = mongoose.model('LostandFound', ticketSchema);
module.exports = LostandFound;