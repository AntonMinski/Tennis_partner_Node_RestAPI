const express = require('express');
const ErrorResponse = require('../diff/utils/errorResponse');
const asyncHandler = require('./async');

const Offers = require('../STRUCTURE/offer/model');

// module.exports = (model, modelName) => {

exports.objectOwner = (model, modelName) => {
    return (req, res, next) => {
        // const object = model.findOne({id: req.params.id});
        model.findOne({id: req.params.id})
            .then(object => {
                // console.log(object);
                if (!object) {
                    return next(new ErrorResponse(
                   `${modelName} with id <${req.params.id}> not exist`), 404);
                }

                // check: user is object owner
                if (object.user.toString() !== req.user.id
                    && req.user.role !== 'admin') {
                    return next(new ErrorResponse(
                        `User is not ${modelName} owner`, 403));
                }

                // if no errors:
                return next();

                // next();
            });
    };
};

exports.alreadyOwner = (model, modelName) => {
    return (req, res, next) => {
        // const object = model.findOne({id: req.params.id});
        model.findOne({user: req.user.id})
            .then(object => {
                if (object && req.user.role !== 'admin') {
                    return next(new ErrorResponse(
                        `you already owner of other ${modelName}`, 400));
                }

                // if no errors:
                return next();

            });
    };
};

    // exports.objectOwner = asyncHandler(async (req, res, next) => {
    //     let object = await model.findOne({_id: req.params.id});
    //     if (!object) {
    //         return next(new ErrorResponse(
    //             `${modelName} with id <${req.params.id}> not exist`), 404);
    //     }
    //
    //     // check: user is object owner
    //     if (req.user.role === 'admin') {
    //         return next(new ErrorResponse(`User is not ${modelName} owner`, 403));
    //     }
    //
    //     // if no errors:
    //     return next();
    // });


// };