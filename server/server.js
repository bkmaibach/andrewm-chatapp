const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message.js');
const {generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js')

const publicPath = path.join(__dirname, '../public', );

const app = express();

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {


    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
           return callback('Name and room name are required!');
        }

        console.log(`New user joined room ${params.room}`);
        socket.emit('newMessage', generateMessage('Admin',
        'Welcome to the Church, may peace and blessings rest upon your scalp'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',
        `${params.name} has joined the chat`));

        socket.join(params.room);
        //socket.leave('Elite Developers');

        //How do we emit events?
        //io.emit() -> goes to everyone
        //socket.broadcast.emit -> goes to everyone except socket
        //socket.emit -> emit to one user

        //What is the room counterpart? Introducing the 'to' method
        //io.to('Elite Developers').emit -> emits to everyone in this room
        //socket.broadcast.to('Elite Developers').emit -> send to everyone in a room except the socket
        users.removeUser(socket.id);
        //The user should be removed from any previous room before being added to this room.
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        callback();
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        var user = users.removeUser(socket.id);

        if (user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message)
        //socket.emit emits to a single connection,
        // while io.emit emits to every single open connection
        var sender = users.getUser(socket.id);

        if(sender && isRealString(message.text)){
            io.to(sender.room).emit('newMessage', generateMessage(sender.name, message.text));
        }
        //In this case the callback actually tells the users message box to clear itself.
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        console.log('createLocationMessage', coords)
        //socket.emit emits to a single connection,
        // while io.emit emits to every single open connection
        var sender = users.getUser(socket.id);
        if(sender){
            io.to(sender.room).emit('newLocationMessage',
             generateLocationMessage(sender.name, coords.latitude, coords.longitude));
        }
    });
});



const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Chat App server is up, listening on port ${port}`)
});