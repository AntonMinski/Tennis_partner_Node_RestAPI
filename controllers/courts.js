const ErrorResponse = require('../utils/errorResponse');
const Courts = require('../models/Courts');


// desc: get all courts
// route: GET /api/v1/courts
// access: Public
exports.getCourts = (req, res, next) => {
    Courts.find()
        .then(data =>
            res.status(200).json({
                success: true,
                length: data.length,
                data: data
        })
        )
        .catch(err => {
            next(new ErrorResponse(
                `Court with id ${req.params.id} was not found`, 404));
            }
        )
};

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
        .catch(error => {
            next(new ErrorResponse(
                `Court with id <${req.params.id}> was not found`,
                404));
            });
};

// desc: create court
// route: POST /api/v1/offers/
// access: Private
exports.postCourt = async (req, res, next) => {
    console.log(req.body);
    try {
        const court = await Courts.create(req.body);
        res.status(201).json({
            sucess: true,
            data: court
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err
        });
    }
};

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
        .catch(err => {
            res.status(400).json({
                success: false,
                error: err
            })
        });
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
        .catch(err => {
            res.status(400).json({
                success: false,
                error: err
            })
        });
};
