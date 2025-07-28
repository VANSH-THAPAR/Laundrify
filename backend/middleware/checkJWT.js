const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader||!authHeader.startsWith('Bearer ')){
        return res.status(401).json({error: 'Unauthorized : token missing or invalid'})
    }
    const token = authHeader.split(' ')[1];
    try{
        const decode = jwt.verify(token , process.env.jwt_secret)
        console.log(decode);
        req.user = decode;
        next();
    }catch(err){
        console.log("JWT Verification Failed:", err.message);
    return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
    }
}

module.exports = verifyToken;