document.addEventListener("DOMContentLoaded", content_loader);

function content_loader() {
    document.getElementById('send').addEventListener("click", () => {
        const currDate = new Date();
        const messageContent = document.getElementById('message').value;
        console.log(messageContent);

        // Send message to server
        fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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

        if (messageContent != '') {
            const postElement = document.createElement('div');
            postElement.classList.add('chat-message')
            postElement.innerHTML = `
                <span class='chat-title'></span>
                <div class='chat-msg'>${messageContent}</div>
                <span class='chat-date'>${currDate.toLocaleString()}</span>
            `;
            document.getElementById('messages').appendChild(postElement);
        }

        // Clear message input
        document.getElementById('message').value = "";
    });
}
