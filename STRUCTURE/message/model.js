const mongoose = require('mongoose');
const slugify = require('slugify');


const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please add a message'],
        trim: true,
        maxlengt: [400, `Message can't be longer than 400 characters`]
    },

    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        require: true,
    },

    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        require: true,
    },
});

// Create slug:
// MessageSchema.pre('save', function (next) {
//     this.slug = slugify(this.name, {lower: true});
//     next();
// });

module.exports = mongoose.model('Messages', MessageSchema);