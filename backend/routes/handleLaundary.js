const express = require('express');
const router = express.Router();
const loginSchema = require('../models/laundary');
const jwt = require('jsonwebtoken');
const checkJwt = require('../middleware/checkJWT')
require('dotenv').config();

router.post('/handlelaundary',checkJwt, async (req,res)=>{
    const {roomNumber , name} = req.user;
    const {bedsheet,towel,pillowCover,salwar,lower,nikkar,schoolPant,civilPant,jeans,kurta,tShirt,schoolShirt,civilShirt,sweater,jacket,schoolSweater,coat,blanket,Scarves} = req.body;
    const createLaundary = await loginSchema.create({
        roomId:roomNumber, personName:name ,data:Date.now(),
        bedsheet,towel,pillowCover,salwar,lower,nikkar,schoolPant,civilPant,jeans,kurta,tShirt,schoolShirt,civilShirt,sweater,jacket,schoolSweater,coat,blanket,Scarves
    })
    console.log(createLaundary);
    res.send(createLaundary);
})

module.exports = router;