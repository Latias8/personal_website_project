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
    fs.readFile('blogs.json', 'utf-8', function(err, data){
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
        fs.appendFile("blogs.json", jsonData + '\n', (err) => { // Append new blog entry to file with comma and newline
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

// Endpoint to get chat messages
app.get('/messages', async (req, res) => {
    let messagesPath = path.join(process.cwd(), 'messages.json');
    fs.readFile(messagesPath, 'utf-8', function(err, data){
        if (err) {
            // handle error
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        try {// Parse the data as JSON
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
        fs.appendFile("messages.json", jsonData + '\n', (err) => { // Append new message to file with comma and newline
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

app.get('/main', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

module.exports = app;
