const express = require('express');
const router = express.Router();
const Courts =  require('./model');
const model = require('./model');
const modelName = 'Court';

const {getCourts, getCourt, postCourt, editCourt, deleteCourt}
= require('./controller')

const { authenticated, hasPermission } = require('../../middleware/auth');

// Set permissions:
const { objectOwner, alreadyOwner } = require('../../middleware/modelAuth');


router
    .route('/')
    .get(getCourts)
    .post(authenticated, hasPermission('courtAdmin', 'admin'),
        alreadyOwner(model, modelName), postCourt);

router
    .route('/:id')
    .get(getCourt)
    .put(authenticated, objectOwner(model, modelName), editCourt)
    .delete(authenticated, objectOwner(model, modelName), deleteCourt);


module.exports = router;
