const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Please add username'],
        unique: [true, 'Such user already exists'],
        maxlengt: [30, `can't be longer than 30 characters`]
    },
    email: {
        type: String,
        required: false,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            `Please add a valid email with @ and . signs`],
        maxlengt: [30, `can't be longer than 30 characters`]
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'courtAdmin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlenght: [6, 'Minimum 6 characters'],
        maxlengt: [20, `can't be longer than 20 characters`],
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    createdAt: {
        type: Date,
        default: Date.now
    },

    // Additional fields:

    city: {
        type: String,
        required: [true, 'Please add a city, where you plain to play'],
        trim: true,
        maxlengt: [35, `City can't be longer than 35 characters`],
        default: 'Kiev'
    },
    first_name: {
        type: String,
        trim: true,
        maxlengt: [20, `First name can't be longer than 20 characters`]
    },

    last_name: {
        type: String,
        trim: true,
        maxlengt: [20, `Last name can't be longer than 20 characters`]
    },
    age: {
        type: Number,
        min: [12, 'Too small to play here, please call adults to register'],
        max: [100, 'Are you sure, you still can play?']
    },

    sport_styles: {
        type: [String],
        enum: ['Football', 'Tennis', 'Bike'],
    },
});

// Encrypt password:
UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Check entered password:
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    // create token:
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hash token:
     this.resetPasswordToken = crypto.createHash('sha256')
         .update(resetToken).digest('hex');

     // set expire date:
    this.resetPasswordExpire = Date.now() + 10*60*1000; // 10 minutes

    return resetToken;
};

module.exports = mongoose.model('Users', UserSchema);