const express=require("express")
const http=require("http")
const {Server} = require ("socket.io")
const { connectToDb } = require("./config/db")
const cors=require("cors")
const { userRoutes } = require("./routes/user.routes")

const app=express()

app.use(cors("*"))
app.use(express.json())

const httpServer=http.createServer(app)

httpServer.listen(4000,()=>{
    try {
        connectToDb
        console.log("Connected to the DB and Server is running at 4000...");
    } catch (error) {
        console.log("Errorin connecting to the DB");
    }
})

let sockets={}

const io = new Server(httpServer)

io.on("connection",(socket)=>{
    console.log("User Connected")
    socket.on("name",(msg)=>{
        sockets[msg]=socket
    })
    socket.on("msg",(m)=>{
        // console.log(m);
        sockets[m.to]?.emit("rmsg",m.msg)
    })
    socket.on("disconnect",()=>{
        console.log("disconnected")
    })
})

app.get("/",(ask,give)=>{
    give.send("Mini Whatsapp")
})

app.use("/users",userRoutes)

app.get("/chat",(ask,give)=>{
    give.sendFile(__dirname+"/chat.html")
})
