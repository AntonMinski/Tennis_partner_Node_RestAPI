const mongoose = require('mongoose');
const UserProfileSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true,
    },
    city: {
        type: String,
        required: [true, 'Please add a city, where you plain to play'],
        trim: true,
        maxlengt: [35, `City can't be longer than 35 characters`]
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
        type: String,
        enum: ['Football', 'Tennis', 'Bike'],
    },
});

module.exports = mongoose.model('UserProfiles', UserProfileSchema);
