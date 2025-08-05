const express = require('express');
const router = express.Router();
const laundarySchema = require('../models/laundary');
const checkJWT = require('../middleware/checkJWT');

// GET all laundry entries for a specific date
router.get('/home-laundry', checkJWT, async (req, res) => {
    try {
        const { roomNumber } = req.user;
        const queryDate = req.query.date; // Expected format: 'YYYY-MM-DD'

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
        res.status(500).json({ message: "Server error while fetching laundry data." });
    }
});

// GET a single laundry entry by its ID (for the edit page)
router.get('/laundry/:laundryId', checkJWT, async (req, res) => {
    try {
        const { laundryId } = req.params;
        const laundryEntry = await laundarySchema.findById(laundryId);
        if (!laundryEntry) {
            return res.status(404).json({ message: "Laundry entry not found." });
        }
        res.status(200).json(laundryEntry);
    } catch (err) {
        console.error("Error fetching laundry entry:", err);
        res.status(500).json({ message: "Server error." });
    }
});


// UPDATE a specific laundry entry by its ID
router.put('/laundry/:laundryId', checkJWT, async (req, res) => {
    try {
        const { laundryId } = req.params;
        const updatedData = req.body;

        const updatedEntry = await laundarySchema.findByIdAndUpdate(laundryId, updatedData, { new: true });

        if (!updatedEntry) {
            return res.status(404).json({ message: "Laundry entry not found." });
        }

        res.status(200).json({ message: "Laundry entry updated successfully.", data: updatedEntry });
    } catch (err) {
        console.error("Error updating laundry entry:", err);
        res.status(500).json({ message: "Server error while updating laundry entry." });
    }
});


// DELETE a specific laundry entry by its ID
router.delete('/laundry/:laundryId', checkJWT, async (req, res) => {
    try {
        const { laundryId } = req.params;

        const deletedEntry = await laundarySchema.findByIdAndDelete(laundryId);

        if (!deletedEntry) {
            return res.status(404).json({ message: "Laundry entry not found." });
        }

        res.status(200).json({ message: "Laundry entry deleted successfully." });
    } catch (err) {
        console.error("Error deleting laundry entry:", err);
        res.status(500).json({ message: "Server error while deleting laundry entry." });
    }
});

module.exports = router;