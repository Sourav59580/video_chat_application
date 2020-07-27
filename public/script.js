const socket = io('/')
var myPeer = new Peer(undefined,{
    host : '/',
    port : '3001'
}); 

const peers = {}

var videoGrid = document.getElementById("video-grid");
var myVideo = document.createElement("video");
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video : true,
    audio : true
}).then(stream =>{
   addVideoStream(myVideo,stream)
    
   myPeer.on("call",call=>{
       call.answer(stream)
       const video = document.createElement("video")
       call.on('stream',userVideoStream=>{
           addVideoStream(video,userVideoStream)
       })
   })

   socket.on("user-connected",userId =>{
       connectToNewUser(userId,stream)
   })
})


myPeer.on('open',id =>{
    socket.emit('join-room',ROOM_ID,id)
})

socket.on('user-connected',USER_ID=>{
    console.log('user connected : '+USER_ID);
})

socket.on('user-disconnected',userId=>{
    // console.log('user disconnect : '+userId);
    if(peers[userId])
    peers[userId].close();
})

function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}

function connectToNewUser(userId,stream){
    const call = myPeer.call(userId,stream)
    var video = document.createElement("video");
    call.on('stream',userVideoStream => {
        addVideoStream(video,userVideoStream)
    })
    call.on("close",()=>{
        video.remove();
    })

    peers[userId] = call
}