const http = require('http');
const express = require('express');
const environment = require('dotenv');

// Load env vard:
environment.config({path: './config/config.env'});

const app = express();

// const server = http.createServer((req, res) => {
//     res.setHeader('Content-Type', 'text/html');
//     res.setHeader('X-Powered-By', 'Node.js');
//     res.write('<h1>Hello</h1>');
//     res.end();
// });

const port = process.env.Port || 5000;

app.listen(port,
    console.log(`Running in ${process.env.NODE_ENV} mode on port ${port}`));


