require("dotenv").config();

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const http = require('http')//??
const socketID = require('socket.io')
const { Profanity, ProfanityOptions } = require('@2toad/profanity');
const options = new ProfanityOptions();
options.wholeWord = false;
const profanity = new Profanity(options);
const vid_list = [];
let drinks = undefined;
const visPath = path.join(__dirname, 'vcuc.json');
const brongPath = path.join(__dirname, 'bc.json');
let visit_count = JSON.parse(fs.readFileSync(visPath, "utf8"));
let brong_count = JSON.parse(fs.readFileSync(brongPath, "utf8"));
let drinksPath = path.join(__dirname, 'drinks.json');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

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

app.use(express.static('public'));

app.use(express.json());
app.use(express.static(__dirname + "/public/"));
app.use(cors())

app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    next();
});


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



app.post('/messages', (req, res) => {
    const data = req.body;
    console.log(data)
    if (data) {
        const jsonData = JSON.stringify(data);
        let messagesPath = path.join(__dirname, 'messages.json');
        fs.appendFile(messagesPath, jsonData + '\n', (err) => {
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
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
    path: "/socket.io",
});

server.listen(port, "127.0.0.1", () => {
    console.log("Server listening on", port);
});
function randRange(data) {
    return data[Math.floor(data.length * Math.random())];
}

function toggleSomething() {
    const timeArray = [2000000, 3000000, 1500000, 2500000, 20000000, 30000000, 10000000, 15000000];
    brong_count += 1;
    const jsonData = JSON.stringify(brong_count);
    fs.writeFileSync(brongPath, jsonData, (err) => {
        if (err) {
            console.log(err)
        }
    });
    let data = fs.readFileSync(brongPath, "utf8")
    brong_count = JSON.parse(data)
    io.emit('free-brongles', {
        bc:brong_count
    });

    clearInterval(timer);
    timer = setInterval(toggleSomething, randRange(timeArray));
}

let timer = setInterval(toggleSomething, 10000000);

io.on('connection', function (socket) {
    visit_count += 1;
    const jsonData = JSON.stringify(visit_count);
    console.log()
    fs.writeFileSync(visPath, jsonData, (err) => {
        if (err) {
            console.log(err)
        }
    });
    console.log("viscount" + visit_count)
    let data = fs.readFileSync(visPath, "utf8")
    visit_count = JSON.parse(data)
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
        let check = message.message.split(" ").join("");
        if (profanity.exists(check)) {
            message.message = '*****'
        } else {
            message.message = profanity.censor(message.message)
        }

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
        //console.log(message)
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
            const jsonData = data.split('\n').filter(Boolean).map(JSON.parse);
            res.json(jsonData);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing JSON');
        }
    });
});

// this here is for like the fucking uhh... drinks.

function getNewDrink() {
    fs.readFile(drinksPath, 'utf-8', function(err, data) {
        if (err) {
            console.error(err);
            return;
        }
        const jsonData = data.split('\n').filter(Boolean).map(JSON.parse);
        drinks = jsonData[getRandomInt(jsonData.length)]
    });
}

setInterval(() => {
    getNewDrink()
}, 1000 * 60 * 60 * 24)/*1000 * 60 * 60 * 24*/

getNewDrink() // just to make sure this actually runs when the backend starts.

app.get('/drink', async (req, res) => {
    res.send(drinks)
})


app.get('/stream', async (req, res) => {
    async function isYoutubeLive() {
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
                    console.error('Error getting views: ', error);
                    res.status(500).send('Error getting views');
                });
        })
        .catch(error => {
            console.error('Error getting video: ', error);
            res.status(500).send('Error getting video');
        });
});

app.get('/youtube/best', (req, res) => {
    const apiKey = process.env.API_KEY;
    const channelId = 'UCDnSCd7lAIilJI16TAfawRg';
    const maxResults = 50;

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
            console.error('Error getting most viewed vid: ', error);
            res.status(500).send('Error getting most viewed vid');
        });
});

let vid_received_time = new Date();

async function storeVids(vl) {
    try {
        vid_received_time = new Date()
        vl.length = 0;
        let newRes = await fetch('http://localhost:3000/youtube');
        let newVid = await newRes.json();
        let bestRes = await fetch('http://localhost:3000/youtube/best');
        let bestVid = await bestRes.json();
        vl.push(newVid, bestVid);
        console.log("NEWVIDLIST: ", vl)
    } catch (err) {
        console.log(err)
    }
}

storeVids(vid_list);

setInterval(() => {
    storeVids(vid_list);
}, 4 * 60 * 60 * 1000);

app.get('/vids', (req, res) => {
    const responseObject = {
        vid_list: vid_list,
        received_time: vid_received_time
    }
    res.send(responseObject)
})

function executeOnHours(hours, callback) {
    callback();
    let now = new Date();
    const hoursWithToogle = hours.map(h => {
        return {
            value: h,
            executedToday: now.getHours() === h
        }
    });
    setInterval(() => {
        now = new Date();
        const triggers = hoursWithToogle.filter(h => {
            if (!h.executedToday && h.value === now.getHours()) {
                return h.executedToday = true;
            } else if (h.value !== now.getHours()) {
                h.executedToday = false;
            }
        });
        if (triggers.length) callback();
    }, 30000);
}

executeOnHours([0, 12], function() {
    storeVids(vid_list)
});




app.get('/main', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

module.exports = app;//EMERGENCY