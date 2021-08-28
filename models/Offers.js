const mongoose = require('mongoose');
const OfferSchema = new mongoose.Schema({

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
         required: false,
         trim: true,
         maxlengt: [50, `can't be longer than 50 characters`]
     },
    details: {
         type: String,
         required: false,
         trim: true,
     },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        require: true,
    },
});

module.exports = mongoose.model('Offers', OfferSchema);

/*
    author = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE, related_name='author')
    place = models.CharField(max_length=70)
    time_range = models.CharField(max_length=50)
    level = models.CharField(max_length=15)
    game_type = models.CharField(max_length=20, blank=True)
    details = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

 */