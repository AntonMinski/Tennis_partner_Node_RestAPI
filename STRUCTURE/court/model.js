const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../../diff/utils/geoCoder')


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

    // location still in process
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

    averageRating: Number, // not implemented yet

    cover: {
        type: String,
        required: [true, `Please specify your cover`],
        enum: ['grass', 'clay', 'hard']
    },

    photo: {
        type: String,
        default: 'no-photo.jpg'
    },

    openingDate: {
        type: Date,
        default: Date.now
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true,
    },
});

// Create court slug:
CourtSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

// Geocode & location field creation (packet not working with Ukrai
// CourtSchema.pre('save', async function (next) {
//     const lct = await geocoder.geocode(this.address);
//     this.location = {
//         type: 'Point',
//         coordinates: [lct[0].longitude, lct[0].latitude],
//         formattedAddress: lct[0].formattedAddress,
//         street: lct[0].streetName,
//         streetNuber: lct[0].streetNuber,
//         city: lct[0].streetName
//     }
//     next();
// })

module.exports = mongoose.model('Courts', CourtSchema);