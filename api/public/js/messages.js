document.addEventListener("DOMContentLoaded", content_loader);

let socket = io('http://localhost:3000')//??
socket.on('greeting-from-server', function (message) {
    let el = document.createElement("p");//??
    let content =document.createTextNode(message.greeting);//??
    el.appendChild(content);//??
    document.getElementById('messages').appendChild(el);//??
    socket.emit('greeting-from-client', {//??
        greeting: `User has joined.`//??
    });//??
});

socket.on('message-receive', function (message) {
    const mess = message.message
    const currDate = mess.date
    let message_content = mess.message;
    let user = mess.name;

    if (user == undefined || user == '') {
        user = 'guest';
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message')
    messageElement.innerHTML = `
              <span class='chat-name'>[root@${user} ~]$ </span>
              <div class='chat-msg'>${message_content}</div>
              <span class='chat-date'>${currDate}</span>
          `;
    document.getElementById('messages').appendChild(messageElement);
    console.log('message loaded')
    console.log(mess)
})

function content_loader() {

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

        // Clear message input
        document.getElementById('message').value = "";

    });

    //??

}
