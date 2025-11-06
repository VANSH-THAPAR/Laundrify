const mongoose = require('mongoose');

const laundarySchema = mongoose.Schema({
    // --- ✅ ADD THIS LINE ---
    // This will link each laundry slip to a specific user
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'signupModel' // This should match the model name in your signup.js
    },
    // --- END OF ADDITION ---

    roomId:{
        type: String,
    },
    personName:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    // ... all your items (bedsheet, towel, etc.)
    bedsheet:{ type:Number, default:0 },
    towel:{ type:Number, default:0 },
    pillowCover:{ type:Number, default:0 },
    salwar:{ type:Number, default:0 },
    lower:{ type:Number, default:0 },
    nikkar:{ type:Number, default:0 },
    schoolPant:{ type:Number, default:0 },
    civilPant:{ type:Number, default:0 },
    jeans:{ type:Number, default:0 },
    kurta:{ type:Number, default:0 },
    tShirt:{ type:Number, default:0 },
    schoolShirt:{ type:Number, default:0 },
    civilShirt:{ type:Number, default:0 },
    sweater:{ type:Number, default:0 },
    jacket:{ type:Number, default:0 },
    schoolSweater:{ type:Number, default:0 },
    coat:{ type:Number, default:0 },
    blanket:{ type:Number, default:0 },
    Scarves:{ type:Number, default:0 },
})

const laundaryModel = mongoose.model('laundaryModel',laundarySchema);
module.exports = laundaryModel;