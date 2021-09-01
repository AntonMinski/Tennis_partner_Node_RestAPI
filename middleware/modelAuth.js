const express = require('express');
const ErrorResponse = require('../diff/utils/errorResponse');
const asyncHandler = require('./async');

const Offers = require('../STRUCTURE/offer/model');

// module.exports = (model, modelName) => {

exports.objectOwner = function(model) {
    return asyncHandler(async (req, res, next) => {
        const object = await model.findOne({id: req.params.id});

        if (!object) {
            return next(new ErrorResponse(`${
                model.collection.collectionName} with id <${
                req.params.id}> not exist`), 404);}

        // check: user is object owner
        if (object.user.toString() !== req.user.id
            && req.user.role !== 'admin') {
            return next(new ErrorResponse(`User is not ${
                model.collection.collectionName} owner`, 403));}

        // if no errors:
        return next();
    });
};

exports.alreadyOwner = function (model) {
    return asyncHandler(async (req, res, next) => {
        const object = await model.findOne({user: req.user.id})

        if (object && req.user.role !== 'admin') {
            return next(new ErrorResponse(`you already owner of other ${
                model.collection.collectionName}`, 400));
        }

        // if no errors:
        return next();
    });
};

