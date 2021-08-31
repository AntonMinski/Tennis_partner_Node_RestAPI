const crypto = require('crypto');
const ErrorResponse = require('../../diff/utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const User = require('./model');
const sendEmail = require('../../diff/utils/sendEmail');


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

// desc: user info
// route:
// access: Public
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
        * 60 * 60 * 1000),  httpOnly: true };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;}
    res.status(statusCode).cookie('token', token, options)
        .json({sucess: true, token});
};

// desc: forgot Password
// route: POST /api/v1/auth/forgot_password
// access: Public
exports.forgotPassword = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return next(new ErrorResponse(
            'User with this email not exists', 404));}

    // Create reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // reset url
    const resetUrl = `${req.protocol}://${
        req.get('host')}/api/v1/auth/reset_password/${resetToken}`;

    const message = `You requested a pswword reset. Please make a PUT request
    to: \n\n ${resetUrl}`;
    
    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({sucess: true});

    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(`Can't send email`, 500));
    }
});

// desc: reset Password
// route: PUT /api/v1/auth/reset_password/:reset_token
// access: Public
exports.resetPassword = asyncHandler(async(req, res, next) => {
    //hash token
    const resetPasswordToken = crypto.createHash('sha256')
        .update(req.params.resettoken).digest('hex');

    // find user
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
        if (!user) {
        return next(new ErrorResponse('Invalid token', 400));}

    // Set new pasword:
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res)
});

// desc: update user details 
// route: PUT /api/v1/auth/update_user
// access: Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        username: req.body.username,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators:true
    });

    res.status(200).json({success:true, user})

});

// desc: change user password
// route: PUT /api/v1/auth/change_password
// access: Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    // (by default password.select = false)

    // check password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('current password is incorrect', 401));
    }

    // change password
    user.password = req.body.newPassword
    await user.save();

    sendTokenResponse(user, 200, res);
});

