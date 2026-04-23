const express  = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const userRoute = require('./route/user.route.js')
const {Server} = require('socket.io')
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express()
dotenv.config()

mongoose.connect(process.env.DB_URI).then(()=>console.log('DB connected'));
app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","PUT","POST","DELETE"],
    credentials: true
}))

app.use('/user',userRoute);

// Express inherently creates the HTTP server when you call app.listen()
const server = app.listen(3000,()=>{
    console.log('port running on port 3000');
})

// Attach socket.io directly to the Express server instance
//Initialize socket.io now backend can send event and recieve event
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
    }
});

//handle client connection
//this run when user open frontend, each user = on socket connection
io.on("connection",(socket)=>{
    console.log("user connected");

    socket.on("disconnect",()=>{
        console.log("user dissconected");
    })
})

// Make io accessible in your route controllers!
app.set("io",io);