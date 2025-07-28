const express = require('express');
const router = express.Router();
const signupSchema = require('../models/signup');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/handlesignup',async (req,res)=>{
    const {hostel , roomNumber , name , password} = req.body;
    const signupUser = await signupSchema.create({
        roomId:`${hostel}${roomNumber}`,
        name,password 
    })
    const payload = {
        roomNumber : signupUser.roomId,
        name: signupUser.name
    }
    const token = jwt.sign(payload , `${process.env.jwt_secret}`)
    console.log(token);
    res.json({message:"user and jwt created" , token});
})

module.exports = router;