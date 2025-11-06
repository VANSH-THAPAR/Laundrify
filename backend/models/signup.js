const mongoose = require('mongoose');

const signUpSchema = mongoose.Schema({
    roomId:{
        type: String
    },
    name:{
        type:String
    },
    email:{
        type: String
    },
    password:{
        type:String
    }
})

const signup = mongoose.model('signup',signUpSchema);
module.exports = signup;