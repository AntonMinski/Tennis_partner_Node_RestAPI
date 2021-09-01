const ErrorResponse = require('../../diff/utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const Message = require('./model');

// desc: get one message
// route: GET /api/v1/message/:id
// access: Sender or Receiver
exports.getMessage = asyncHandler (async (req, res, next) => {
    const message = await Message.findById(req.params.id);
    // console.log('entity method');

    // user neither.user not receiver
    if (message.user.toString() !== req.user.id
        && message.receiver.toString() !== req.user.id)
    { return next(
        new ErrorResponse('This message belongs to other users', 403));
    }

    res.status(200).json({success: true, message});
});

// desc: get sent messages
// route: POST /api/v1/messages/sent
// access: Private, Sender only
exports.sentMessages = asyncHandler(async (req, res, next) => {
    const messages = await Message.find({user: req.user.id});
    res.status(201).json({sucess: true, messages});
});


// desc: get received messages
// route: POST /api/v1/messages/received
// access: Private, Receiver only
exports.receivedMessages = asyncHandler(async (req, res, next) => {
        const messages = await Message.find({ receiver: req.user.id });
        res.status(201).json({sucess: true, messages});
});



