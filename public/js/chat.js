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
    var params = jQuery.deparam(window.location.search);
    params.room = params.room.toLowerCase();
    socket.emit('join', params, (error) => {
        if (error){
            alert(error);
            window.location.href = '/'
        } else {
            console.log('Join successful')
        }
    });
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(nameArray) {
    console.log('updateUserList with: ', nameArray);
    var ul = jQuery('<ul></ul>');
    nameArray.forEach(name => {
        ul.append(jQuery('<li></li>').text(name));
    });

    //using .html instead of .append replaces the contents
    jQuery('#users').html(ul);
});

socket.on('updateRoomList', function(roomArray) {
    console.log('updateRoomList with: ', roomArray);
    var ul = jQuery('<ul></ul>');
    roomArray.forEach(room => {
        ul.append(jQuery('<li></li>').text(room));
    });
    jQuery('#rooms').html(ul);
});

socket.on('newMessage', function(message){
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
    }, function(err){
        locationButton.removeAttr('disabled').text('Send location');
        console.log(err);
        alert(`Unable to fetch location: ${err}`);
    });
});
