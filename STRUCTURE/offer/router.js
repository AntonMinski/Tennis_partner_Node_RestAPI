const express = require('express');
const router = express.Router();
const model = require('./model');

const { authenticated, hasPermission } = require('../../middleware/auth');

// Set permissions:
const { objectOwner, alreadyOwner } = require('../../middleware/modelAuth');

const { getObjects, getObject, postObject, editObject, deleteObject } =
    require('../base_module/base_controller');

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


module.exports = router;
