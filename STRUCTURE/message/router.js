const express = require('express');
const router = express.Router();
const Message =  require('./model');
const model = require('./model');


const {getMessage, sentMessages, receivedMessages} = require('./controller')

// Set authorization permissions:
const { authenticated } = require('../../middleware/auth');
// Set permissions:
const { objectOwner } = require('../../middleware/modelAuth');
// controller:
const { getObjects, getObject, postObject, editObject, deleteObject } =
    require('../base_module/base_controller');

//use:
router
    .route('/')
    .get(authenticated, getObjects(model))
    .post(authenticated, postObject(model));

router.route('/sent').get(authenticated, sentMessages)
router.route('/received').get(authenticated, receivedMessages)

router
    .route('/:id')
    .get(authenticated, getMessage)
    .put(authenticated, objectOwner(model), editObject(model))
    .delete(authenticated, objectOwner(model), deleteObject(model));


module.exports = router;
