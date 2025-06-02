const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Simulate server delay endpoint
app.get('/api/delay', (req, res) => {
    const delay = Math.floor(Math.random() * 5) + 1;
    setTimeout(() => {
        res.json({ delay });
    }, delay * 1000);
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 