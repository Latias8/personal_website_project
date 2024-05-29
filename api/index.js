const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cors = require('cors');
const fs = require('fs');

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
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

/*
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
                console.log(fs.readFileSync("messages.json", "utf8"));
            }
        });
        res.status(200).send('Message received and stored successfully');
    } else {
        res.status(400).send('Bad Request: Missing message or date');
        console.log(data)
    }
});
*/

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
    const apiKey = 'AIzaSyA-Drb-5llWow0293aP7jRV4CeWtk7qSt4';
    const channelId = 'UCDnSCd7lAIilJI16TAfawRg';

    let videoId;

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=1&type=video&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const newestVideo = data.items[0];
            videoId = newestVideo.id.videoId;

            // Extract title and thumbnail from snippet
            const title = newestVideo.snippet.title;
            const thumbnailUrl = newestVideo.snippet.thumbnails.default.url;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`)
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


app.get('/main', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

module.exports = app;