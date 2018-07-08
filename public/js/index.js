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

socket.on('newLocationMessage', function(message){
    console.log('New location message received', message);
    //Use jQuery to CREATE an element!
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${message.from}: `);
    //How to set an attribute like the link href:
    a.attr('href', message.url);
    li.append(a);
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

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function(){
        alert('Unable to fetch location')
    });
});
