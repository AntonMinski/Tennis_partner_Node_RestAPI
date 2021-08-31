const express = require('express');
const router = express.Router();
const Message =  require('./model');
const model = require('./model');
const modelName = 'Message';

const {getMessages, getMessage, postMessage, editMessage, deleteMessage,
sentMessages, receivedMessages} = require('./controller')

// Set authorization permissions:
const { authenticated } = require('../../middleware/auth');
// Set permissions:
const { objectOwner } = require('../../middleware/modelAuth');


//use:
router
    .route('/')
    .get(authenticated, getMessages)
    .post(authenticated, postMessage);

router.route('/sent').get(authenticated, sentMessages)
router.route('/received').get(authenticated, receivedMessages)

router
    .route('/:id')
    .get(authenticated, getMessage)
    .put(authenticated, objectOwner(model, modelName), editMessage)
    .delete(authenticated, objectOwner(model, modelName), deleteMessage);


module.exports = router;
