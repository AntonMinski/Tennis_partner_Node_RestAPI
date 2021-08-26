const http = require('http');
const express = require('express');
const environment = require('dotenv');

// Route files
const offers_router = require('./routes/offers');

// Load env vard:
environment.config({path: './config/config.env'});

const app = express();

//mount routers:
app.use('/api/v1/offers', offers_router)


const port = process.env.Port || 5000;

app.listen(port,
    console.log(`Running in ${process.env.NODE_ENV} mode on port ${port}`));


