const express = require('express')
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4 : uuidv4 } = require('uuid')

//view engine set
app.set("view engine","ejs")
//use static folder
app.use(express.static('public'))

//Routes
app.get("/",(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get("/:room",(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

//socket.io
io.on("connection",socket =>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)
        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit('user-disconnected',userId)
        })
    })
})




server.listen(3000)