const express = require('express');
const connectDb = require('./db/db');
const app = express();
const port = 3000;

const cors = require('cors');
const router = require('./routes/handleUser');
const laundaryrouter = require('./routes/handleLaundary');
const homeLaundary = require('./routes/handleHomepage');
const profile = require('./routes/profile');
const chatroomRoutes = require('./routes/chatRoom');
app.use(cors());

const http = require('http');
const { Server } = require("socket.io");
const { initSocket } = require('./middleware/socket'); // We will create this file next

app.use(express.json());
app.use(express.urlencoded({extended: true}));
connectDb();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://laundrify-vansh.netlify.app"], // Your frontend URL
    methods: ["GET", "POST"]
  }
});

app.get('/',(req,res)=>{
    res.send(`Hi i the backend is working at port ${port}`);
})

// handleUser
app.use('/',router);
app.use('/',laundaryrouter);
app.use('/',homeLaundary);
app.use('/', profile);
app.use('/', chatroomRoutes);

initSocket(io);
server.listen(port,"0.0.0.0",()=>{
    console.log(`http://localhost:${port}`);
})