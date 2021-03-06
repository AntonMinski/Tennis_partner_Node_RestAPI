const ErrorResponse = require('../diff/utils/errorResponse')

const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    error.message = err.message


    // console handling
    console.log(error.message.red.bold)
    // console.log(err.stack.red)

    // Mongoose bad object
    if (err.name === 'CastError') {
        const message = `Object with id <${err.value}> was not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000 ) {
        const message = 'Duplicate field entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError' ) {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    });
};

module.exports = errorHandler;

