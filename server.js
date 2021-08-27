const http = require('http');
const express = require('express');
const environment = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./models/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');

// Load env vars:
environment.config({path: './config/config.env'});

// connect to Database:
connectDB();

// Route files
const offers_router = require('./routes/offers');
const courts_router = require('./routes/courts');


const app = express();

//body parser:
app.use(express.json());

// middleware:
// logging request detail:
app.use(morgan('dev'));

//mount routers:
app.use('/api/v1/offers', offers_router);
app.use('/api/v1/courts', courts_router);

app.use(errorHandler);

const port = process.env.Port || 5000;
const server = app.listen(port,
    console.log(`Running in ${process.env.NODE_ENV} mode on port ${port}`
        .blue));

// Handle unhandled promise rejections:
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error:${err.message}`.red.bold);
    //close server & exit process:
    server.close(() => process.exit(1));
});


