const express = require('express');
const app = express();
const port = 3000;
const chatPort = 4000;
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const http = require('http')//??
const socketID = require('socket.io')
const { parse } = require('node-html-parser');
const { Profanity, ProfanityOptions } = require('@2toad/profanity');
const options = new ProfanityOptions();
options.wholeWord = false;
const profanity = new Profanity(options);
let visit_count = 0;
let vid_list = [];
profanity.addWords([
    "\t",  // Tab (U+0009)
    "\n",  // Line Feed (U+000A)
    "\v",  // Vertical Tab (U+000B)
    "\f",  // Form Feed (U+000C)
    "\r",  // Carriage Return (U+000D)
    "\u00A0",  // No-Break Space
    "\u1680",  // Ogham Space Mark
    "\u2000",  // En Quad
    "\u2001",  // Em Quad
    "\u2002",  // En Space
    "\u2003",  // Em Space
    "\u2004",  // Three-Per-Em Space
    "\u2005",  // Four-Per-Em Space
    "\u2006",  // Six-Per-Em Space
    "\u2007",  // Figure Space
    "\u2008",  // Punctuation Space
    "\u2009",  // Thin Space
    "\u200A",  // Hair Space
    "\u200B",  // Zero Width Space
    "\u2028",  // Line Separator
    "\u2029",  // Paragraph Separator
    "\u202F",  // Narrow No-Break Space
    "\u205F",  // Medium Mathematical Space
    "\u3000"   // Ideographic Space
])
const message_list = [];
//??
//const Ably = require('ably');

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

// ably stuff!!!!

/*

const ably = new Ably.Realtime('cGvO1g.XwCFfg:qdisGd27vqDZUoJjoZ4SCsLl2GR7V2NEja3G3dy3nh4');
const channel = ably.channels.get('chat');

channel.subscribe('greeting-from-client', (message) => {
    console.log('Greeting from client:', message.data);
});


 */

app.get("/", (req, res) => { res.send("Express on Vercel");})

app.get('/messcount', (req, res) => {
    res.send(message_list);
});


app.get('/entries', async (req, res) => {
    let blogsPath = path.join(__dirname, 'blogs.json');
    fs.readFile(blogsPath, 'utf-8', function(err, data){
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        try {
            const lines = data.split('\n');
            console.log('LINES: ' + lines)
            const jsonData = lines.map(line => {
                try {
                    return JSON.parse(line);
                } catch (parseError) {
                    console.error(parseError);
                    return null;
                }
            }).filter(Boolean);
            res.json(jsonData);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing JSON');
        }
    });
});

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
        fs.appendFile(blogsPath, jsonData + '\n', (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error writing file');
            } else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                console.log(fs.readFileSync("blogs.json", "utf8"));
                res.redirect('/index');
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
    let messagesPath = path.join(__dirname, 'messages.json');
    fs.readFile(messagesPath, 'utf-8', function(err, data) {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        try {
            const jsonData = data.split('\n').filter(Boolean).map(JSON.parse);
            res.json(jsonData);
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
let io = socketID(server)



io.on('connection', function (socket) {//??
    visit_count += 1;
    //emit message to client
    socket.emit('greeting-from-server', {
        greeting:'Remember! Be nice! :D',
        prev_mess:message_list
    })

    io.emit('user-joined', {
        uc:visit_count
    });



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

     */

    socket.on('message-send', message => {
        message.message = profanity.censor(message.message)
        /*
        const jsonData = JSON.stringify(message);
        let messagesPath = path.join(__dirname, 'messages.json');
        fs.appendFile(messagesPath, jsonData + '\n', (err) => {
            if (err)
                console.log(err);
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
            }
        });

         */
        message_list.push(message)
        io.emit('message-receive', message)
        console.log(message)
    })


})






// MOAR ABLY STUFFFFF

/*
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



 */



app.get('/devlogs', async (req, res) => {
    let devlogsPath = path.join(__dirname, 'devlogs.json');
    fs.readFile(devlogsPath, 'utf-8', function(err, data) {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        try {
            const jsonData = data.split('\n').filter(Boolean).map(JSON.parse);
            res.json(jsonData);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing JSON');
        }
    });
});

app.get('/mood', async (req, res) => {
    let moodPath = path.join(__dirname, 'mood.json');
    fs.readFile(moodPath, 'utf-8', function(err, data) {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        try {
            const jsonData = data.split('\n').filter(Boolean).map(JSON.parse); // Split by newline, filter empty entries, and parse each JSON object
            res.json(jsonData); // Send JSON data back to the client
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing JSON');
        }
    });
});


app.get('/stream', async (req, res) => {
    async function isYoutubeLive() {
        // uhh youtube thing uhmmhuuhuhuhu
        let channelid = "UCnB-Fhp5FQfCZNfdAvm27Qw";
        let channelname = "@Isigia_Official";

        let channelidurl = 'https://www.youtube.com/channel/' + channelid;
        let channelnameurl = 'https://www.youtube.com/' + channelname;

        try {
            let response = await fetch(channelnameurl);
            let html = await response.text();
            return html.includes("hqdefault_live.jpg");
        } catch (err) {
            console.warn('Something went wrong', err);
            return false;
        }

        // code 'borrowed' from https://github.com/bogeta11040/if-youtube-channel-live/blob/main/yt.js
    }

     async function isTwitchLive() {
         try {
             let response = await fetch(`https://twitch.tv/isigia`);
             let html = await response.text();
             return html.includes('isLiveBroadcast');
         } catch (err) {
             console.warn('Something went wrong', err);
             return false;
         }
        // borrowed from user 'Cookie' on https://stackoverflow.com/questions/75376762/how-to-check-if-a-twitch-streamer-is-live
    }

    const youtubeLive = await isYoutubeLive();
    const twitchLive = await isTwitchLive();

    console.log(youtubeLive);
    console.log(twitchLive);

    res.send({ youtubeLive, twitchLive });

})

app.get('/youtube', (req, res) => {
    const apiKey = process.env.API_KEY;
    const channelId = 'UCDnSCd7lAIilJI16TAfawRg';

    let videoId;

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=1&type=video&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const newestVideo = data.items[0];
            videoId = newestVideo.id.videoId;

            const title = newestVideo.snippet.title;
            const thumbnailUrl = newestVideo.snippet.thumbnails.default.url;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    const views = data.items[0].statistics.viewCount;

                    const responseObject = {
                        views: views,
                        title: title,
                        thumbnailUrl: thumbnailUrl,
                        videoUrl: videoUrl
                    };

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

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&type=video&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const videoIds = data.items.map(item => item.id.videoId);

            return fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds.join(',')}&key=${apiKey}`);
        })
        .then(response => response.json())
        .then(data => {
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

async function storeVids(vl) {
    let newRes = await fetch('/youtube');
    let newVid = await newRes.json();
    let bestRes = await fetch('/youtube/best');
    let bestVid = await bestRes.json();
    vl.push(newVid, bestVid);
}

app.get('/vids', (req, res) => {
    res.send(vid_list)
})




app.get('/main', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

module.exports = app;