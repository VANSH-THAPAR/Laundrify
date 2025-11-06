const express = require('express');
const router = express.Router();
const loginSchema = require('../models/laundary');
const jwt = require('jsonwebtoken');
const checkJwt = require('../middleware/checkJWT')
require('dotenv').config();

router.post('/handlelaundary', checkJwt, async (req,res)=>{
    // --- ✅ GET THE 'id' FROM THE TOKEN ---
    const { roomNumber, name, id } = req.user;
    
    // Get all the item counts from the body
    const {bedsheet,towel,pillowCover,salwar,lower,nikkar,schoolPant,civilPant,jeans,kurta,tShirt,schoolShirt,civilShirt,sweater,jacket,schoolSweater,coat,blanket,Scarves} = req.body;
    
    // --- ✅ ADD 'userId: id' TO THE CREATE CALL ---
    const createLaundary = await laundarySchema.create({
        userId: id, // <-- This is the fix
        roomId: roomNumber,
        personName: name,
        // ... all the items
        bedsheet,towel,pillowCover,salwar,lower,nikkar,schoolPant,civilPant,jeans,kurta,tShirt,schoolShirt,civilShirt,sweater,jacket,schoolSweater,coat,blanket,Scarves
    })
    
    console.log(createLaundary);
    res.send(createLaundary);
})

module.exports = router;