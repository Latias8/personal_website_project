document.addEventListener("DOMContentLoaded", content_loader);




function content_loader() {
    let socket = io('http://localhost:3000')//??
    socket.on('greeting-from-server', function (message) {
        let el = document.createElement("p");//??
        let content =document.createTextNode(message.greeting);//??
        el.appendChild(content);//??
        document.getElementById('messages').appendChild(el);//??
        //socket.emit('greeting-from-client', {//??
        //    greeting: `User has joined.`//??
        //});//??
    });

    socket.on('message-receive', function (message) {
        const mess = message;
        console.log(mess)
        const currDate = mess.date;
        let message_content = mess.message;
        let user = mess.name;

        if (user === undefined || user === '') {
            user = 'guest';
        }

        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `
                <div class='pre-flex'>
                <span class='chat-name'>[root@<a>${user}</a> ~]$ </span>
                <span class='chat-date'>${currDate}</span>
                </div> 
                <div class='chat-msg'>${message_content}</div>
            `;
        document.getElementById('messages').appendChild(messageElement);
        console.log('message loaded');
        console.log(mess);
    })


    document.getElementById('send').addEventListener("click", () => {

        const preDate = new Date();
        const currDate = preDate.toLocaleString()
        const messageContent = document.getElementById('message').value;
        const user = document.getElementById('userNameInput').value
        console.log(messageContent);

        socket.emit('message-send', {//??
            date: currDate,
            message: messageContent,
            name: user
        });



        // Clear message input
        document.getElementById('message').value = "";

    });

    socket.on('user-joined')

    //??




    /*
    // Initialize Ably
    const ably = new Ably.Realtime('nononononono');

// Create a channel
    const channel = ably.channels.get('chat');

// Subscribe to messages on the 'chat' channel
    channel.subscribe('message-receive', function(message) {
        const mess = message.data;
        const currDate = mess.date;
        let message_content = mess.message;
        let user = mess.name;

        if (user === undefined || user === '') {
            user = 'guest';
        }

        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `
                <div class='pre-flex'>
                <span class='chat-name'>[root@<a>${user}</a> ~]$ </span>
                <span class='chat-date'>${currDate}</span>
                </div> 
                <div class='chat-msg'>${message_content}</div>
            `;
        document.getElementById('messages').appendChild(messageElement);
        //console.log('message loaded');
        //console.log(mess);
    });

// Function to send a greeting message to the server
    function sendGreeting() {
        const message = {
            greeting: 'User has joined.'
        };
        channel.publish('greeting-from-client', message);
    }

// Subscribe to the 'greeting-from-server' event
    channel.subscribe('greeting-from-server', function(message) {
        const greetingMessage = message.data;
        const el = document.createElement('p');
        const content = document.createTextNode(greetingMessage.greeting);
        el.appendChild(content);
        document.getElementById('messages').appendChild(el);

        sendGreeting();
    });

// Emit a greeting message when the client joins
    sendGreeting();

    document.getElementById('send').addEventListener("click", () => {
        const preDate = new Date();
        const currDate = preDate.toLocaleString();
        const messageContent = document.getElementById('message').value;
        const user = document.getElementById('userNameInput').value;
        //console.log(messageContent);

        // Publish the message to the 'chat' channel
        channel.publish('message-send', {
            date: currDate,
            message: messageContent,
            name: user
        });

        // Clear message input
        document.getElementById('message').value = "";
    });
    */

    document.querySelector('.main-cover').addEventListener('click', () => {
        let cover = document.querySelector('.main-cover');
        let box = document.querySelector('.user-warn-notif-parent')
        cover.style.opacity = '0';
        cover.style.pointerEvents = 'none';
        box.style.opacity = '0';
        box.style.pointerEvents = 'none';
    }, true);

}


// IN SEND EVENTLISTENER!
/*

        // Send message to server
        fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: user,
                message: messageContent,
                date: currDate.toLocaleString()
            })
        })
            .then(response => {
                if (response.ok) {
                    // Message sent successfully, do something if needed
                } else {
                    console.error('Failed to send message to server');
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
        */
/*
if (messageContent != '') {
    const postElement = document.createElement('div');
    postElement.classList.add('chat-message')
    postElement.innerHTML = `
        <span class='chat-name'>[root@${user} ~]$ </span>
        <div class='chat-msg'>${messageContent}</div>
        <span class='chat-date'>${currDate.toLocaleString()}</span>
    `;
    /*document.getElementById('messages').appendChild(postElement);

}
*/