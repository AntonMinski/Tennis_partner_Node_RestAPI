const ErrorResponse = require('../../diff/utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const bodyParser = require('body-parser');


// desc: get all objects
// route: GET /api/v1/objects
// access: Public
exports.getObjects = function(model) {
    // console.log(model.collectionName);
    return asyncHandler(async (req, res, next) => {
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
    query = model.find(JSON.parse(queryStr));

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
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const objects = await query;

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
            length: objects.length,
            pagination,
            data: objects
        });
});
};


// desc: get one object
// route: GET /api/v1/objects/:id
// access: Public
exports.getObject = function(model) {
    return asyncHandler(async (req, res, next) => {
        const object = await model.findById(req.params.id);
        res.status(200).json({success: true, object});
    });
};

// desc: create object
// route: POST /api/v1/objects/
// access: Private
exports.postObject = function(model) {
    return asyncHandler(async (req, res, next) => {
        req.body.user = req.user.id;

        // save to db
        const object = await model.create(req.body);
        res.status(201).json({sucess: true, data: object});
    });
};
// desc: edit object
// route: PUT /api/v1/objects/:id
// access: Private
exports.editObject = function(model) {
    return asyncHandler(async (req, res, next) => {
        object = await model.findOneAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({success: true, object});
    });
};

// desc: delete object
// route: DELETE /api/v1/objects/:id
// access: Private
exports.deleteObject = function(model) {
    return asyncHandler(async (req, res, next) => {
        const object = await model.findByIdAndRemove(req.params.id);
        res.status(200).json({success: true, data: {}});
    });
};