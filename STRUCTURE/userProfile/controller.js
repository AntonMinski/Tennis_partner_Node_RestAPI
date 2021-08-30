const ErrorResponse = require('../../diff/utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const Profile = require('./model');


// desc: get all profiles
// route: GET /api/v1/profiles
// access: Private
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
// access: Private
exports.getOwnProfile = asyncHandler (async (req, res, next) => {
    const profile = await Profile.find({user: req.user.id});

    // if (!profile) {
    //     return next(new ErrorResponse(
    //         `Profile not exist yet`), 404);}

    res.status(200).json({success: true, message: profile});
});

// desc: create profile
// route: POST /api/v1/profiles/
// access: Private
exports.postUserProfile = asyncHandler(async (req, res, next) => {
        req.body.user = req.user.id;
        const profile = await Profile.create(req.body);
        res.status(201).json({sucess: true, data: profile});
});

// desc: edit own profile
// route: PUT /api/v1/profiles/:id
// access: Private
exports.editUserProfile = asyncHandler(async (req, res, next) => {
    let profile = await Profile.findById(req.params.id);

    if (req.body.sport_styles) {
        req.body.sport_styles =
            Array.isArray(req.body.sport_styles) ? req.body.sport_styles : [req.body.sport_styles];
    }

    profile = await Profile.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({success: true, profile});
});

// desc: delete profile
// route: DELETE /api/v1/profiles/:id
// access: Private
exports.deleteUserProfile = asyncHandler (async (req, res, next) => {
    const profile = await Profile.findOne({id: req.params.id});


    if (!profile) {
        return next(new ErrorResponse(
            `Profile with id <${req.params.id}> not exist`), 404);}

    // check: user is profile owner
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse('User is not profile owner', 403));}

    // Delete:
    profile.remove();
    res.status(200).json({success: true, data: {} });
});
