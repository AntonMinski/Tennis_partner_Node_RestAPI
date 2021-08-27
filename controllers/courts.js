const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Courts = require('../models/Courts');


// desc: get all courts
// route: GET /api/v1/courts
// access: Public
exports.getCourts = asyncHandler(async (req, res, next) => {
    const courts = await Courts.find();

    res.status(200).json({
            success: true,
            length: courts.length,
            data: courts
        });
});

// desc: get one offer
// route: GET /api/v1/courts/:id
// access: Public
exports.getCourt = (req, res, next) => {
    Courts.findById(req.params.id)
        .then(data =>
            res.status(200).json({
                success: true,
                data: data
            }))
        .catch(err => next(err) );
};

// desc: create court
// route: POST /api/v1/offers/
// access: Private
exports.postCourt = asyncHandler(async (req, res, next) => {

        const court = await Courts.create(req.body);
        res.status(201).json({
            sucess: true,
            data: court
        });
});

// desc: edit offer
// route: PUT /api/v1/offers/:id
// access: Private
exports.editCourt = (req, res, next) => {
    Courts.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
        .then(data =>
            res.status(200).json({
                success: true,
                data: data
            }))
        .catch(err => next(err));
};

// desc: delete offer
// route: DELETE /api/v1/offers/:id
// access: Private
exports.deleteCourt = (req, res, next) => {
    Courts.findByIdAndDelete(req.params.id)
        .then(data =>
            res.status(200).json({
                success: true,
                data: {}
            }))
        .catch(err => next(err));
};
