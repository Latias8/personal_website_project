const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cors = require('cors');

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

let blogPosts = []; // Array to store blog posts
let messages = []; // Array to store chat messages

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

app.get("/", (req, res) => { res.send("Express on Vercel");})

// Endpoint to get blog posts
app.get('/entries', (req, res) => {
    res.json(blogPosts);
});

// Endpoint to submit new blog posts via URL parameters
app.get('/gandalf/blog/submit/:text', (req, res) => {
    const text = req.params.text;
    console.log(text)
    if (text) {
        const now = new Date();
        blogPosts.push({
            date: now.getTime(),
            text
        });
        res.redirect('/main'); // Redirect to the main page after submitting
    } else {
        res.status(400).send('Bad Request: Missing blog post text');
    }
});

app.get("/", (req, res) => { res.send("Express on Vercel");})

// Endpoint to get chat messages
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Endpoint to submit new chat messages
app.post('/messages', (req, res) => {
    const { message, date } = req.body;
    if (message && date) {
        messages.push({ message, date });
        res.status(200).send('Message received and stored successfully');
    } else {
        res.status(400).send('Bad Request: Missing message or date');
        console.log(message)
        console.log(date)
    }
});

app.get('/main', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

module.exports = app;
