const express = require('express');
const router = express.Router();

// Set permissions:
const {authenticated, hasPermission} = require('../../middleware/auth');
const {objectOwner, alreadyOwner} = require('../../middleware/modelAuth');
// get controller:

const {getObjects, getObject, postObject, editObject, deleteObject} =
        require('./base_controller');

// create router:
module.exports = (model) => {

    router
        .route('/')
        .get(getObjects(model))
        .post(authenticated, hasPermission('courtAdmin', 'admin'),
            alreadyOwner(model), postObject(model));

    router
        .route('/:id')
        .get(getObject(model))
        .put(authenticated, objectOwner(model), editObject(model))
        .delete(authenticated, objectOwner(model), deleteObject(model));

    return router
};
