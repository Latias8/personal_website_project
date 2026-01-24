document.addEventListener("DOMContentLoaded", content_loader);




function content_loader() {
    function message_loader(mess) {
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
    }

    const socket = io(window.location.origin, {
        path: "/socket.io",
        transports: ["websocket", "polling"],
    });

    socket.on('greeting-from-server', function (message) {
        //socket.emit('greeting-from-client', {//??
        //    greeting: `User has joined.`//??
        //});//??
        message.prev_mess.forEach((mess) => {
            message_loader(mess)
        })
        let el = document.createElement("p");//??
        let content =document.createTextNode(message.greeting);//??
        el.appendChild(content);//??
        document.getElementById('messages').appendChild(el);//??
    });

    socket.on('message-receive', function (message) {
        const mess = message;
        console.log(mess);
        message_loader(mess);
        console.log('message loaded');
        console.log(mess);
    })


    document.getElementById('send').addEventListener("click", () => {

        const preDate = new Date();
        const currDate = preDate.toLocaleString()
        const messageContent = document.getElementById('message').value;
        const user = document.getElementById('userNameInput').value
        console.log(messageContent);

        socket.emit('message-send', {
            date: currDate,
            message: messageContent,
            name: user
        });



        // Clear message input
        document.getElementById('message').value = "";

    });

    document.getElementById('message').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('send').click()
        }
    });

    socket.on('user-joined', function (data) {
        let el = document.createElement("p");//??
        el.classList.add('.user_join')
        let content =document.createTextNode('User has joined');//??
        el.appendChild(content);//??
        document.getElementById('messages').appendChild(el);//??
        let uc = data.uc;
        document.querySelector('.peaks').innerHTML = `
        ${uc}
        `
    })

    socket.on('free-brongles', function (data) {
        let bc = data.bc;
        document.querySelector('.bronglecronts').innerHTML = `
        ${bc}
        `
    })



}
