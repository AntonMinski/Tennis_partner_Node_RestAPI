const ErrorResponse = require('../../diff/utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const Offer = require('./model');


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
exports.getOffer = asyncHandler (async (req, res, next) => {
    const offer = await Offer.findById(req.params.id);
    res.status(200).json({success: true, offer});
});

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
exports.editOffer = asyncHandler(async (req, res, next) => {
    let offer = Offer.findById(req.params.id);

    if (!offer) {
        return next(new ErrorResponse(
            `Offer with id <${req.params.id}> not exist`), 404);}

    // check: user is offer owner
    if (offer.user.toString() !== req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse('User is not offer owner', 403));}

    // update court:
    offer = await Offer.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({success: true, offer});
});

// desc: delete offer
// route: DELETE /api/v1/offers/:id
// access: Private
exports.deleteOffer = asyncHandler (async (req, res, next) => {
    const offer = Offer.findById(req.params.id);

    if (!offer) {
        return next(new ErrorResponse(
            `Offer with id <${req.params.id}> not exist`), 404);}

    // check: user is offer owner
    if (offer.user != req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse('User is not offer owner', 403));}

    // Delete:
    offer.remove();
    res.status(200).json({success: true, data: {} });
});
