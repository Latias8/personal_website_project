const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

let blogPosts = [{"date": "22:46", "text": "It\'s so nice having to MANUALLY enter this in js. I need to get the backend working asap..."}]; // Array to store blog posts

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Endpoint to get blog posts
app.get('/gandalf/blog', (req, res) => {
    res.json(blogPosts);
});

// Endpoint to submit new blog posts via URL parameters
app.get('/gandalf/blog/submit', (req, res) => {
    const { text } = req.query;
    if (text) {
        const now = new Date();
        blogPosts.push({
            date: now.getTime(),
            text
        });
        res.redirect('/index.html'); // Redirect to the main page after submitting
    } else {
        res.status(400).send('Bad Request: Missing blog post text');
    }
});
