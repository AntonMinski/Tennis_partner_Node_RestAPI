const jwt = require('jsonwebtoken');
const ErrorResponse = require('../diff/utils/errorResponse');
const asyncHandler = require('./async');
const User = require('../STRUCTURE/user/model');
const Message = require('../STRUCTURE/message/model');
const Courts = require('../STRUCTURE/court/model');
const Offers = require('../STRUCTURE/offer/model');

// Protect routes:
exports.authenticated = asyncHandler(async (req, res, next) => {
    let token;

    // token from Bearer token in header
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // token from cookies:
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

        return next();
    } catch (err) {
        console.log(err);
    }
});

// Give access to specific roles:
exports.rolePermission = (...roles) => {  // roles from array ..roles can do that action
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






