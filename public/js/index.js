var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
    // socket.emit('createMessage', {
    //     from:'jeff@something.com',
    //     text:"From a form, typically"
    // });
});



socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message){
    console.log('New message received', message)
});

