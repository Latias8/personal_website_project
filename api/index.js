const express = require('express');
const app = express();
const port = 3000;
const chatPort = 4000;
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const http = require('http')//??
//const socketID = require('socket.io')//??
const Ably = require('ably');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(__dirname + "/public/"));
app.use(cors())

// Middleware to set MIME type for CSS files
app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    next();
});

/*

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

 */

const ably = new Ably.Realtime('cGvO1g.XwCFfg:qdisGd27vqDZUoJjoZ4SCsLl2GR7V2NEja3G3dy3nh4');
const channel = ably.channels.get('chat');

channel.subscribe('greeting-from-client', (message) => {
    console.log('Greeting from client:', message.data);
});

app.get("/", (req, res) => { res.send("Express on Vercel");})

// Endpoint to get blog posts
app.get('/entries', async (req, res) => {
    let blogsPath = path.join(__dirname, 'blogs.json');
    fs.readFile(blogsPath, 'utf-8', function(err, data){
        if (err) {
            // handle error
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        try {
            // Split the data by newline
            const lines = data.split('\n');
            console.log('LINES: ' + lines)
            const jsonData = lines.map(line => {
                try {
                    // Parse each line as JSON
                    return JSON.parse(line);
                } catch (parseError) {
                    console.error(parseError);
                    // Handle parse errors by returning null
                    return null;
                }
            }).filter(Boolean); // Filter out any null values
            res.json(jsonData); // Send JSON data back to the client
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing JSON');
        }
    });
});

// Endpoint to submit new blog posts via URL parameters
app.get('/gandalf/blog/submit/:text', (req, res) => {
    const text = req.params.text;
    console.log(text)
    if (text) {
        const now = new Date();
        const data = {
            "date": now.getTime(),
            "text": text
        }
        const jsonData = JSON.stringify(data);
        let blogsPath = path.join(__dirname, 'blogs.json');
        fs.appendFile(blogsPath, jsonData + '\n', (err) => { // Append new blog entry to file with comma and newline
            if (err) {
                console.log(err);
                res.status(500).send('Error writing file');
            } else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                console.log(fs.readFileSync("blogs.json", "utf8"));
                res.redirect('/main'); // Redirect to the main page after submitting
            }
        });
    } else {
        res.status(400).send('Bad Request: Missing blog post text');
    }
});


app.get("/", (req, res) => { res.send("Express on Vercel");})

/* MESSAGE STUFF OLD

// Endpoint to get chat messages
app.get('/messages', async (req, res) => {
    let messagesPath = path.join(__dirname, 'messages.json'); // Use __dirname to get the directory of the current script
    fs.readFile(messagesPath, 'utf-8', function(err, data) {
        if (err) {
            // handle error
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        try {
            // Parse the data as JSON
            const jsonData = data.split('\n').filter(Boolean).map(JSON.parse); // Split by newline, filter empty entries, and parse each JSON object
            res.json(jsonData); // Send JSON data back to the client
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing JSON');
        }
    });
});


// Endpoint to submit new chat messages
app.post('/messages', (req, res) => {
    const data = req.body;
    console.log(data)
    if (data) {
        const jsonData = JSON.stringify(data); // Convert data object to JSON string
        let messagesPath = path.join(__dirname, 'messages.json');
        fs.appendFile(messagesPath, jsonData + '\n', (err) => { // Append new message to file with comma and newline
            if (err)
                console.log(err);
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
            }
        });
        res.status(200).send('Message received and stored successfully');
    } else {
        res.status(400).send('Bad Request: Missing message or date');
        console.log(data)
    }
});

*/
let server = http.Server(app)
server.listen(port);
/*let io = socketID(server)

io.on('connection', function (socket) {//??
    //emit message to client
    socket.emit('greeting-from-server', {
        greeting:'Remember! Be nice! :D'
    })

    /*
    socket.on('greeting-from-client', data => {//??
        socket.emit('greeting-from-server',{//??
            greeting:'Hello Client'//??
        })//??
    })//??
    //??


    socket.on('message-send', data => {
        io.emit('message-receive', {
            message: data
        })
    })
})
*/



channel.subscribe('message-send', (message) => {
    const data = message.data;
    channel.publish('message-receive', data, (err) => {
        if (err) {
            console.log('Error publishing message:', err);
        } else {
            console.log('Message received and broadcasted:', data);
        }
    });
});

// Emit greeting message when the server starts
channel.publish('greeting-from-server', {
    greeting: 'Remember! Be nice! :D'
}, (err) => {
    if (err) {
        console.log('Error publishing greeting:', err);
    } else {
        console.log('Greeting published');
    }
});


// Endpoint to get devlogs
app.get('/devlogs', async (req, res) => {
    let devlogsPath = path.join(__dirname, 'devlogs.json'); // Use __dirname to get the directory of the current script
    fs.readFile(devlogsPath, 'utf-8', function(err, data) {
        if (err) {
            // handle error
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        try {
            // Parse the data as JSON
            const jsonData = data.split('\n').filter(Boolean).map(JSON.parse); // Split by newline, filter empty entries, and parse each JSON object
            res.json(jsonData); // Send JSON data back to the client
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing JSON');
        }
    });
});

app.get('/mood', async (req, res) => {
    let moodPath = path.join(__dirname, 'mood.json'); // Use __dirname to get the directory of the current script
    fs.readFile(moodPath, 'utf-8', function(err, data) {
        if (err) {
            // handle error
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        try {
            // Parse the data as JSON
            const jsonData = data.split('\n').filter(Boolean).map(JSON.parse); // Split by newline, filter empty entries, and parse each JSON object
            res.json(jsonData); // Send JSON data back to the client
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing JSON');
        }
    });
});

app.get('/youtube', (req, res) => {
    const apiKey = process.env.API_KEY;
    const channelId = 'UCDnSCd7lAIilJI16TAfawRg';

    let videoId;

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=1&type=video&key=${apiapiapi}`)
        .then(response => response.json())
        .then(data => {
            const newestVideo = data.items[0];
            videoId = newestVideo.id.videoId;

            // Extract title and thumbnail from snippet
            const title = newestVideo.snippet.title;
            const thumbnailUrl = newestVideo.snippet.thumbnails.default.url;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiapiapi}`)
                .then(response => response.json())
                .then(data => {
                    const views = data.items[0].statistics.viewCount;

                    // Construct response object with views, title, and thumbnail
                    const responseObject = {
                        views: views,
                        title: title,
                        thumbnailUrl: thumbnailUrl,
                        videoUrl: videoUrl
                    };

                    // Send the response object
                    res.send(responseObject);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    res.status(500).send('Error fetching data');
                });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
        });
});

app.get('/youtube/best', (req, res) => {
    const apiKey = process.env.API_KEY;
    const channelId = 'UCDnSCd7lAIilJI16TAfawRg';
    const maxResults = 50; // Maximum number of videos to fetch in one request

    // Step 1: Fetch the videos from the channel
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&type=video&key=${apiapiapi}`)
        .then(response => response.json())
        .then(data => {
            const videoIds = data.items.map(item => item.id.videoId);

            // Step 2: Get the statistics (view count) for each video
            return fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds.join(',')}&key=${apiapiapi}`);
        })
        .then(response => response.json())
        .then(data => {
            // Step 3: Find the video with the highest view count
            let maxViews = 0;
            let mostViewedVideo = null;

            data.items.forEach(video => {
                const views = parseInt(video.statistics.viewCount, 10);
                if (views > maxViews) {
                    maxViews = views;
                    mostViewedVideo = video;
                }
            });

            if (mostViewedVideo) {
                // Step 4: Send the response with the details of the video with the most views
                const responseObject = {
                    views: mostViewedVideo.statistics.viewCount,
                    title: mostViewedVideo.snippet.title,
                    thumbnailUrl: mostViewedVideo.snippet.thumbnails.default.url,
                    videoUrl: `https://www.youtube.com/watch?v=${mostViewedVideo.id}`
                };

                res.send(responseObject);
            } else {
                res.status(404).send('No videos found');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
        });
});


app.get('/main', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

module.exports = app;