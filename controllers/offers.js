const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Offer = require('../models/Offers');


// desc: get all offers
// route: GET /api/v1/offers
// access: Public
exports.getOffers =asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.UserId) {
        query = Offer.find({ user: req.params.userId });
    } else {
        query = Offer.find();
    }
    const offers = await query;

    res.status(200).json({
        sucess: true,
        count: offers.length,
        data: offers
    })
});

// desc: get one offer
// route: GET /api/v1/offers/:id
// access: Public
exports.getOffer = (req, res, next) => {
    res.status(200).json({sucess: true});
};

// desc: create offer
// route: POST /api/v1/offers/
// access: Private
exports.postOffer = asyncHandler (async (req, res, next) => {
    // Add user to body:
    req.body.user = req.user.id;
    const offer = await Offer.create(req.body);

    res.status(200).json({sucess: true, offer});
});

// desc: edit offer
// route: PUT /api/v1/offers/:id
// access: Private
exports.editOffer = (req, res, next) => {
    res.status(200).json({sucess: true});
};

// desc: delete offer
// route: DELETE /api/v1/offers/:id
// access: Private
exports.deleteOffer = (req, res, next) => {
    res.status(200).json({sucess: true});
};
