const mongoose = require('mongoose');
const CourtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        unique: true,
        maxlengt: [70, `Name can't be longer than 70 characters`]
    },

    slug: String,

    phone: {
        type: String,
        maxlength: [30, `Phone can't be longer than 30 characters`]
    },

    address: {
      type: String,
      reqired: [true, 'Please add an address']
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            // required: true
        },
        coordinated: {
            type: [Number],
            // required: true,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },

    rating: {
        type: Number,
        min: [1, `Rating must be at lest 1`],
        min: [5, `Rating cant be more than 5`]
    },

    averageRating: Number,

    cover: {
        type: String,
        required: [true, `Please specify your cover`],
        maxlenght: [30, `This field can't ne longer than 30 characters`]
    },

    photo: {
        type: String,
        default: 'no-photo.jpg'
    },

    openingDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Courts', CourtSchema);