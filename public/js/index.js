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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    //Use jQuery to CREATE an element!
    var li = jQuery('<li></li>');
    var strong = jQuery('<h4></h4>');
    strong.append(message.from);
    //li.text(`${message.from} ${formattedTime}: ${message.text}`);
    li.append(strong);
    li.append(` ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    console.log('New location message received', message);
    //Use jQuery to CREATE an element!
    var li = jQuery('<li></li>');
    var strong = jQuery('<h4></h4>');
    strong.append(message.from);
    var formattedTime = moment(message.createdAt).format(' h:mm a: ');
    var a = jQuery('<a target="_blank">My current location</a>');
    //How to set an attribute like the link href:
    a.attr('href', message.url);
    li.append(strong);
    li.append(formattedTime)
    li.append(a);
    jQuery('#messages').append(li);
});

var messageTextBox = jQuery('[name=message]');

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your browser');
    }

    //The location button is diabled upon clicking, and is re-enabled inside the callback below:
    locationButton.attr('disabled', 'disabled').text('Retrieving location...');

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function(){
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});
