const ErrorResponse = require('../../diff/utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const Courts = require('./model');


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

// desc: get one court
// route: GET /api/v1/courts/:id
// access: Public
exports.getCourt = asyncHandler (async (req, res, next) => {
    const court = await Courts.findById(req.params.id);
    res.status(200).json({success: true, court});
});

// desc: create court
// route: POST /api/v1/courts/
// access: Private
exports.postCourt = asyncHandler(async (req, res, next) => {
        req.body.user = req.user.id;

        //check is this user admins other courts already:
        const courtAdmin = await Courts.findOne({ user: req.user.id});
        if (courtAdmin && req.user.role !== 'admin') {
        return next(new ErrorResponse('you already admin of other court', 400));
        }

        // save to db
        const court = await Courts.create(req.body);
        res.status(201).json({
            sucess: true,
            data: court
        });
});

// desc: edit court
// route: PUT /api/v1/courts/:id
// access: Private
exports.editCourt = asyncHandler(async (req, res, next) => {
    let court = await Courts.findById(req.params.id);
    console.log('1:', req.user.id)
    console.log('2:', court)

    if (!court) {
        return next(new ErrorResponse(
            `Court with id <${req.params.id}> not exist`), 404);}

    // check: user is court owner
    console.log(court.user);
    if (court.user.toString() !== req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse('User is not court owner', 403));
    }
    // update court:
    court = await Courts.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({success: true, court});
});

// desc: delete court
// route: DELETE /api/v1/courts/:id
// access: Private
exports.deleteCourt = asyncHandler (async (req, res, next) => {
    const court = Courts.findById(req.params.id);

    if (!court) {
        return next(new ErrorResponse(
            `Court with id <${req.params.id}> not exist`), 404);}

    // check: user is court owner
    if (court.user != req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse('User is not court owner', 403));}

    // Delete:
    court.remove();
    res.status(200).json({success: true, data: {} });
});
