const mongoose = require('mongoose');
const OfferSchema = new mongoose.Schema({

    place: {
        type: String,
        required: [true, 'Please add a place, where you want to play'],
        trim: true,
        maxlengt: [70, `can't be longer than 70 characters`]
    },
    time_range: {
         type: String,
         required: [true, 'Please add a time, when you want to play'],
         trim: true,
         maxlengt: [50, `can't be longer than 50 characters`]
     },
    level: {
         type: String,
         required: [true, 'Please specify you level'],
         trim: true,
         maxlengt: [40, `can't be longer than 40 characters`]
     },
    game_type: {
         type: String,
         trim: true,
         maxlengt: [50, `can't be longer than 50 characters`]
     },
    details: {
         type: String,
         trim: true,
     },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true,
    },
});

module.exports = mongoose.model('Offers', OfferSchema);
