const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

let blogPosts = []; // Array to store blog posts

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

app.post('/gandalf/blog', (req, res) => {
    const obj = req.body;
    const now = new Date();

    // Add the received blog post to the array
    blogPosts.push({
        date: now.getTime(),
        text: obj.text
    });

    // Redirect to the index.html page
    res.redirect('/index.html');
});

// Serve index.html with blog posts
app.get('/index.html', (req, res) => {
    fs.readFile(__dirname + '/index.html', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading index.html:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Inject blog posts into index.html
        let html = data.replace('<div id="root"></div>', generateBlogPostsHTML());

        res.send(html);
    });
});

// Function to generate HTML for blog posts
function generateBlogPostsHTML() {
    let postsHTML = '';

    blogPosts.forEach(post => {
        postsHTML += `
            <div class="blog-post">
                <h2>${new Date(post.date).toLocaleString()}</h2>
                <p>${post.text}</p>
            </div>`;
    });

    return postsHTML;
}
