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
    console.log('New message received', message);
    //Use jQuery to CREATE an element!
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});


// socket.emit('createMessage', {from:'Frank', text:'Hi'}, function (ackData) {
//     console.log('Acknowledged', ackData)
// });

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {

    });
});
