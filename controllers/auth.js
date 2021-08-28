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

    // Create token:
    const token = user.getSignedJwtToken();

    res.status(200).json({
            sucess: true,
            token
        });
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

    // Create token:
    const token = user.getSignedJwtToken();

    res.status(200).json({
            sucess: true,
            token
        });
});

