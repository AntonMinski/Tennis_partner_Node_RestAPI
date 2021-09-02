const http = require('http');
const express = require('express');
const environment = require('dotenv'); // variables from config file
const morgan = require('morgan');  // HTTP request logger
const colors = require('colors'); // colors in console
const cookieParser = require('cookie-parser'); // Parse Cookie header and populate req.cookies
// security:
const mongoSanitize = require('express-mongo-sanitize'); // sql injections prevention
const helmet = require('helmet'); // vss protection and security headers
const xss = require('xss-clean'); //  html script atacks prevention
const rateLimit = require("express-rate-limit"); // ddos attack prevention
const hpp = require('hpp'); // HTTP Parameter Pollution attacks prevention
const cors = require('cors');

const errorHandler = require('./middleware/error');
const connectDB = require('./STRUCTURE/db');

// Load env vars:
environment.config({path: './config/config.env'});

// connect to Database:
connectDB();

// Route files:
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

// Sanitize data (prevent sql injections)
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  }),
);

// Set security headers:
app.use(helmet());

// Prevent cross site scripting (XSS attacks):
app.use(xss());

// Rate limiting:
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
//  apply to all requests
app.use(limiter);

// Prevent http param pollution:
app.use(hpp());

// allow cors options:
app.use(cors());

//mount routers:
app.use('/api/v1/offers', offers_router);
app.use('/api/v1/courts', courts_router);
app.use('/api/v1/auth', auth_router);
app.use('/api/v1/messages', message_router);
app.use('/api/v1/profile', profile_router);

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


