const chatService = require('../api/chat/chat.service')

var gIo = null

function connectSockets(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        console.log('New socket', socket.id)
        socket.on('join_room', (topic)=>{
            if (socket.myTopic === topic) return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic
            console.log(`User ${socket.id} joined room ${topic}`);
        })
    
        socket.on('send_message', (data)=>{
            chatService.add(data)
            socket.to(data.room).emit('receive_message', data)
        })
    
        socket.on('disconnect', ()=>{
            console.log('user diconnected', socket.id);
        })
    })
}

module.exports = {
    connectSockets
}