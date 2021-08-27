const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Courts = require('../models/Courts');


// desc: get all courts
// route: GET /api/v1/courts
// access: Public
exports.getCourts = asyncHandler(async (req, res, next) => {
    let query;

    // copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators $gt/$lte/...
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,
            match => `$${match}`);
    // Find a resource
    query = Courts.find(JSON.parse(queryStr));

    // Select fields:
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('_id');
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page -1) * limit;
    const endIndex = page * limit;
    const total = await Courts.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const courts = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page -1,
            limit
        }
    }

    res.status(200).json({
            success: true,
            length: courts.length,
            pagination,
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
