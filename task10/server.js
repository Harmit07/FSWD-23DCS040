const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const LOG_FILE = path.join(__dirname, 'logs', 'error.txt');

app.get('/logs', (req, res) => {
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err.message);
            return res.status(500).send(`
                <!DOCTYPE html>
                <html>
                    <head><title>Error</title></head>
                    <body style="font-family: sans-serif;">
                        <h1>Unable to read log file</h1>
                        <p>${err.message}</p>
                    </body>
                </html>
            `);
        }

        res.send(`
            <!DOCTYPE html>
            <html>
                <head><title>Error Logs</title></head>
                <body style="font-family: monospace; white-space: pre-wrap;">
                    <h1>Error Logs</h1>
                    <pre>${data}</pre>
                </body>
            </html>
        `);
    });
});

// Home route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Log Viewer</h1><p>Go to <a href="/logs">/logs</a> to view error logs.</p>');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
