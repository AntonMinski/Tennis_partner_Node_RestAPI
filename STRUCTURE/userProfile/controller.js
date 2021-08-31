const ErrorResponse = require('../../diff/utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const Profile = require('./model');


// desc: get all profiles for admin only)
// route: GET /api/v1/profiles
// access: Private (by middleware role permissions)
exports.getUserProfiles = asyncHandler(async (req, res, next) => {



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
    query = Profile.find(JSON.parse(queryStr));

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
    const total = await Profile.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const profiles = await query;

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
            length: profiles.length,
            pagination,
            data: profiles
        });
});

// desc: get own profile
// route: GET /api/v1/profiles
// access: Private (made by middleware)
exports.getOwnProfile = asyncHandler (async (req, res, next) => {
    const profile = await Profile.find({user: req.user.id});
    res.status(200).json({success: true, message: profile});
});

// desc: create profile
// route: POST /api/v1/profiles/
// access: Private (made by middleware)
exports.postUserProfile = asyncHandler(async (req, res, next) => {
        req.body.user = req.user.id;
        const profile = await Profile.create(req.body);
        res.status(201).json({sucess: true, data: profile});
});

// desc: edit own profile
// route: PUT /api/v1/profiles/:id
// access: Private(made by middleware)
exports.editUserProfile = asyncHandler(async (req, res, next) => {
    profile = await Profile.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({success: true, profile});
});

// desc: delete profile
// route: DELETE /api/v1/profiles/:id
// access: Private (made by middleware)
exports.deleteUserProfile = asyncHandler (async (req, res, next) => {
    const profile = await Profile.findByIdAndRemove(req.params.id);
    res.status(200).json({success: true, data: {} });
});
