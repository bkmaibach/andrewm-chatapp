const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public', );

const app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.emit('newMessage', {from:'Admin', text:'Welcome to the chat app'});
    socket.broadcast.emit('newMessage', {from:'Admin', text:'New user joined'});

    socket.on('disconnect', (socket) => {
        console.log('Client disconnected');
    });

    socket.on('createMessage', (createdMessage) => {
        console.log('createMessage', createdMessage)
        //socket.emit emits to a single conneection,
        // while io.emit emits to every single open connection
        // io.emit('newMessage', {
        //     from: createdMessage.from,
        //     text: createdMessage.text,
        //     createdAt: new Date().getTime()
        // });

        //Socket.broadcast emits to everyone but itself (socket)
        socket.broadcast.emit('newMessage', {
            from: createdMessage.from,
            text: createdMessage.text,
            createdAt: new Date().getTime()
        });
    });
});



const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Chat App server is up, listening on port ${port}`)
});