const http = require('http');
const express = require('express');
const environment = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/error');
const connectDB = require('./STRUCTURE/db');

// Load env vars:
environment.config({path: './config/config.env'});

// connect to Database:
connectDB();

// Route files
const offers_router = require('./STRUCTURE/offer/router');
const courts_router = require('./STRUCTURE/court/router');
const auth_router = require('./STRUCTURE/user/router');
const message_router = require('./STRUCTURE/message/router');
const profile_router = require('./STRUCTURE/userProfile/router');


const app = express();

//body parser:
app.use(express.json());

// cookie parser:
app.use(cookieParser());

// middleware:
// logging request detail:
app.use(morgan('dev'));

//mount routers:
app.use('/api/v1/offers', offers_router);
app.use('/api/v1/courts', courts_router);
app.use('/api/v1/auth', auth_router);
app.use('/api/v1/messages', message_router);
app.use('/api/v1/profiles', profile_router);

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


