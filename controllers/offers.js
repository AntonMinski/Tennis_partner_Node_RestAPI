// desc: get all offers
// route: GET /api/v1/offers
// access: Public
exports.getOffers = (req, res, next) => {
    res.status(200).json({sucess: true});
};

// desc: get one offer
// route: GET /api/v1/offers/:id
// access: Public
exports.getOffer = (req, res, next) => {
    res.status(200).json({sucess: true});
};

// desc: create offer
// route: POST /api/v1/offers/
// access: Private
exports.postOffer = (req, res, next) => {
    res.status(200).json({sucess: true});
};

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
