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

    socket.on('disconnect', (socket) => {
        console.log('Client disconnected');
    });
});



const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Chat App server is up, listening on port ${port}`)
});