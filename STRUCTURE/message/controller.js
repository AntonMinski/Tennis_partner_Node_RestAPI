const ErrorResponse = require('../../diff/utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const Message = require('./model');


// desc: get all messages
// route: GET /api/v1/messages
// access: Public
exports.getMessages = asyncHandler(async (req, res, next) => {
    let query;

    // copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators $gt/$lte/...
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,
            match => `$${match}`);
    // Find a resource
    query = Message.find(JSON.parse(queryStr));

    // Select fields:
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('_id');
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page -1) * limit;
    const endIndex = page * limit;
    const total = await Message.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const messages = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page -1,
            limit
        }
    }

    res.status(200).json({
            success: true,
            length: messages.length,
            pagination,
            data: messages
        });
});

// desc: get one message
// route: GET /api/v1/message/:id
// access: Public
exports.getMessage = asyncHandler (async (req, res, next) => {
    const message = await Message.findById(req.params.id);

    // user neither sender not receiver
    if (message.sender.toString() !== req.user.id
        && message.receiver.toString() !== req.user.id)
    { return next(
        new ErrorResponse('This message belongs to other users', 403));
    }

    res.status(200).json({success: true, message});
});

// desc: get sent messages
// route: POST /api/v1/messages/sent
// access: Private
exports.sentMessages = asyncHandler(async (req, res, next) => {
        const messages = await Message.find({ sender: req.user.id });
        res.status(201).json({sucess: true, messages});
});


// desc: get received messages
// route: POST /api/v1/messages/received
// access: Private
exports.receivedMessages = asyncHandler(async (req, res, next) => {
        const messages = await Message.find({ receiver: req.user.id });
        res.status(201).json({sucess: true, messages});
});


// desc: create message
// route: POST /api/v1/messages/
// access: Private
exports.postMessage = asyncHandler(async (req, res, next) => {
        req.body.sender = req.user.id;

        const message = await Message.create(req.body);
        res.status(201).json({sucess: true, data: message});
});

// desc: edit message
// route: PUT /api/v1/messages/:id
// access: Private
exports.editMessage = asyncHandler(async (req, res, next) => {
    let message = await Message.findById(req.params.id);

    // update message:
    message = await Message.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({success: true, message});
});

// desc: delete message
// route: DELETE /api/v1/messages/:id
// access: Private
exports.deleteMessage = asyncHandler (async (req, res, next) => {
    const message = await Message.findOne({id: req.params.id});

    // Delete:
    message.remove();
    res.status(200).json({success: true, data: {} });
});
