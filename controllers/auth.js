const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');


// desc: register user
// route: POST /api/v1/auth/register
// access: Public
exports.register = asyncHandler(async(req, res, next) => {
        const {username, email, password, role } = req.body;

    //create user:
    const user = await User.create({
        username, email, password, role })

    // send token and cookie:
    sendTokenResponse(user, 200, res);
});

// desc: login user
// route: POST /api/v1/auth/login
// access: Public
exports.login = asyncHandler(async(req, res, next) => {
        const {username, password} = req.body;

    // Validate email and password:
     if (!username || !password) {
       return next(new ErrorResponse('Please provide email and password', 400))
     }

     // Check user in DB:
    const user = await User.findOne({ username }).select('+password');
     if (!user) {
         return next(new ErrorResponse('User not exist in system', 401));
     }

     // Check password
    const isMatch = await user.matchPassword(password);
     if (!isMatch) {
         return  next(new ErrorResponse('Wrong password', 401));
     }

    // send token and cookie:
    sendTokenResponse(user, 200, res);
});

exports.getUser = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({sucess: true, data: user});
});



// Get token, send cookie:
const sendTokenResponse = (user, statusCode, res) => {
    // create token:
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24
        * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({sucess: true, token});

};

