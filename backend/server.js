const express = require('express');
const connectDb = require('./db/db');
const app = express();
const port = 3000;

connectDb();
app.get('/',(req,res)=>{
    res.send(`Hi i the backend is working at port ${port}`);
})

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})