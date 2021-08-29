const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    }
});

// Encrypt password:
UserSchema.pre('save', async function(next) {
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
}

module.exports = mongoose.model('Users', UserSchema);