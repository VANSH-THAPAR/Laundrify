const express = require('express');
const router = express.Router();
const signupSchema = require('../models/signup');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.post('/handlesignup', async (req, res) => {
    const { hostel, roomNumber, name, password } = req.body;

    if (!hostel || !roomNumber || !name || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    try {
        const roomId = `${hostel}${roomNumber}`;


        const existingUser = await signupSchema.findOne({ name });
        if (existingUser) {
            return res.status(409).json({ message: "A user with this name already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await signupSchema.create({
            roomId,
            name,
            password: hashedPassword
        });

        const payload = {
            roomNumber: newUser.roomId,
            name: newUser.name,
            id: newUser._id
        };

        const token = jwt.sign(payload, process.env.jwt_secret, { expiresIn: '7d' });
        
        res.status(201).json({ message: "User created successfully", token });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Server error during registration." });
    }
});

router.post('/handlelogin', async (req, res) => {
    const { roomId, name, password } = req.body;

    if (!roomId || !name || !password) {
        return res.status(400).json({ message: "Room ID, name, and password are required." });
    }

    try {

        const user = await signupSchema.findOne({ name: name, roomId: roomId });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please check your details." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials. Please check your password." });
        }


        const payload = {
            roomNumber: user.roomId,
            name: user.name,
            id: user._id
        };

        const token = jwt.sign(payload, process.env.jwt_secret, { expiresIn: '7d' });

        res.status(200).json({ message: "Login successful", token });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;
