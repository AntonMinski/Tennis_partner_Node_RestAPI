const jwt = require('jsonwebtoken');
const ErrorResponse = require('../diff/utils/errorResponse');
const asyncHandler = require('./async');
const User = require('../STRUCTURE/user/model');
const userProfile = require('../STRUCTURE/userProfile/model');
const Message = require('../STRUCTURE/message/model');
const Courts = require('../STRUCTURE/court/model');
const Offer = require('../STRUCTURE/offer/model');

// Protect routes:
exports.authenticated = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // else if (req.cookies.token) {
    //     token = req.cookies.token
    // }

    if (!token) {
        return next(new ErrorResponse('Not authenticated', 401))
    }

    try {
        // verify token:
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {

    }
});
let model;
let modelName;

let baseOwner = asyncHandler(async (req, res, next) => {
    let object = await model.findById(req.params.id);

    if (!object) {
        return next(new ErrorResponse(
            `${modelName} with id <${req.params.id}> not exist`), 404);}

    // check: user is court owner
    if (object.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User is not ${modelName} owner`, 403));
    }

    // if no errors:
    return next();
});

// COURTS MODEL:
model = Courts;
modelName = 'Court'
exports.CourtAdmin2 = baseOwner;

// MESSAGE MODEL

// Give access to specific roles:
exports.hasPermission = (...roles) => {  // roles from array ..roles can do that action
    return (req, res, next) => {
         if (!roles.includes(req.user.role)) {
             return next(new ErrorResponse(
            `User role ${req.user.role} has no permissions, access denied`, 403));
         }
         next();
    }
};

exports.profileOwner = asyncHandler(async (req,res, next) => {
    const profile = await userProfile.findOne({user: req.user.id});

    // Profile not exists yet:
    if (!profile) {
        return next(new ErrorResponse('Profile not exists yet', 404));
    }

    // User is not profile owner:
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('User is not profile owner', 403));
    }

    // if no errors:
    return next();
});

exports.alreadyHasProfile = asyncHandler(async (req, res, next) => {
    const profile = await userProfile.findOne({user: req.user.id});

    if (profile) {
        return next(new ErrorResponse('You already profile owner', 404));
    }

     // if no errors:
    return next();
});

exports.messageSender = asyncHandler(async (req, res, next) => {
    const message = await Message.findOne({_id: req.params.id});

    if (!message) {
        return next(new ErrorResponse(
            `Message with id <${req.params.id}> not exist`), 404);
    }

    // check: user is message sender
    if (message.sender.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('User is not message sender1', 403));}

    // if no errors:
    return next();
});

exports.courtAdmin = asyncHandler(async (req, res, next) => {
    const court = await Courts.findById(req);

    if (!court) {
        return next(new ErrorResponse(
            `Court with id <${req.params.id}> not exist`), 404);}

    // check: user is court owner
    if (court.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('User is not court owner', 403));
    }

    // if no errors:
    return next();
});

court2Admin = (model, req, res, next) => {
    const object = model.findById(req.params.id);

    if (!object) {return next(new ErrorResponse(
        `${model} with id <${req.params.id}> not exist`), 404);}

    // check: user is object owner
    if (object.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User is not ${object} owner`, 403));
    }

    // if no errors:
    return next();
};

// exports.court2Admin = baseOwner(Courts);




