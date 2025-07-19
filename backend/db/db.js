const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("The database was connected successfully");
    }
    catch(err){
        console.log(err);
    }
}

module.exports = connectDb;