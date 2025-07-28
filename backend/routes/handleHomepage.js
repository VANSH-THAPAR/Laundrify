const express = require('express');
const router = express.Router();
const laundarySchema = require('../models/laundary');
const checkJWT = require('../middleware/checkJWT');

router.get('/home-laundry', checkJWT, async (req, res) => {
    try {
        const { roomNumber, name } = req.user;
        const queryDate = req.query.date; // Expected format: 'YYYY-MM-DD'

        // Use selected date or today's date
        const selectedDate = queryDate ? new Date(queryDate) : new Date();

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const todayLaundary = await laundarySchema.find({
            roomId: roomNumber,
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        res.status(200).json(todayLaundary);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
