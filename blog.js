const express = require('express');
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

// Endpoint to get blog posts
app.get('/gandalf/blog', (req, res) => {
    res.json(blogPosts);
});

// Endpoint to submit new blog posts via URL parameters
app.get('/gandalf/blog/submit', (req, res) => {
    const text = req.query.text;
    console.log(text)
    if (text) {
        const now = new Date();
        blogPosts.push({
            date: now.getTime(),
            text
        });
        res.redirect('/index'); // Redirect to the main page after submitting
    } else {
        res.status(400).send('Bad Request: Missing blog post text');
    }
});

app.get('/index', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname })
    /*res.sendFile('style.css', { root: __dirname })*/

})


/*
<script>
  // Function to fetch and display blog posts
  async function fetchAndDisplayBlogPosts() {
    const response = await fetch('/gandalf/blog');
    const data = await response.json();

    // Clear existing blog posts
    const rootElement = document.getElementById('root');
    rootElement.innerHTML = '';

    // Display each blog post
    data.forEach(post => {
      const postElement = document.createElement('div');
      postElement.innerHTML = `
                <h2>${new Date(post.date).toLocaleString()}</h2>
                <p>${post.text}</p>
            `;
      rootElement.appendChild(postElement);
    });
  }

  // Call the function to fetch and display blog posts when the page loads
  window.onload = fetchAndDisplayBlogPosts;
</script>
* */