var socket = io();

function scrollToBottom(){
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);

    }
}

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
    // console.log('New message received', message);
    var formattedTime = moment(message.createdAt).format('h:mm a');

    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text:message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message){
    // console.log('New message received', message);
    var formattedTime = moment(message.createdAt).format('h:mm a');

    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,
        {
            url: message.url,
            from: message.from,
            createdAt: formattedTime
        }
    );

    jQuery('#messages').append(html);
    scrollToBottom();
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
