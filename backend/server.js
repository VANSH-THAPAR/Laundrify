const express = require('express');
const connectDb = require('./db/db');
const app = express();
const port = 3000;

const cors = require('cors');
const router = require('./routes/handleUser');
const laundaryrouter = require('./routes/handleLaundary')
const homeLaundary = require('./routes/handleHomepage');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
connectDb();

app.get('/',(req,res)=>{
    res.send(`Hi i the backend is working at port ${port}`);
})

// handleUser
app.use('/',router);
app.use('/',laundaryrouter);
app.use('/',homeLaundary);

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})