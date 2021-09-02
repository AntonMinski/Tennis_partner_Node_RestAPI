const express = require('express');

// authentication, role:
const {authenticated, rolePermission} = require('../../middleware/auth');
const {objectOwner, alreadyOwner} = require('../../middleware/permissions');

// get controllers:
const {getObjects, getObject, postObject, editObject, deleteObject} =
        require('./base_controller');

// create router:
module.exports = function(model) {

    const router = express.Router();

    router
        .route('/')
        .get(getObjects(model))
        .post(authenticated, rolePermission('courtAdmin', 'admin'),
            alreadyOwner(model), postObject(model));

    router
        .route('/:id')
        .get(getObject(model))
        .put(authenticated, objectOwner(model), editObject(model))
        .delete(authenticated, objectOwner(model), deleteObject(model));

    return router
};
