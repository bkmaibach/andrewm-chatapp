const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message.js');
const {generateLocationMessage} = require('./utils/message.js');

const publicPath = path.join(__dirname, '../public', );

const app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.emit('newMessage', generateMessage('Admin',
     'Welcome to the Church, may peace and blessings rest upon your scalp'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined the chat'));

    socket.on('disconnect', (socket) => {
        console.log('Client disconnected');
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message)
        //socket.emit emits to a single connection,
        // while io.emit emits to every single open connection
        io.emit('newMessage', generateMessage(message.from, message.text));
        //In this case the callback actually tells the users message box to clear itself.
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        console.log('createLocationMessage', coords)
        //socket.emit emits to a single connection,
        // while io.emit emits to every single open connection
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
});



const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Chat App server is up, listening on port ${port}`)
});