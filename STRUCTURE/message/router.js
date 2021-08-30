const express = require('express');
const router = express.Router();
const Message =  require('./model');

const {getMessages, getMessage, postMessage, editMessage, deleteMessage,
sentMessages, receivedMessages} = require('./controller')
const { authenticated, hasPermission, messageSender } =
    require('../../middleware/auth');


router
    .route('/')
    .get(authenticated, getMessages)
    .post(authenticated, postMessage);

router.route('/sent').get(authenticated, sentMessages)
router.route('/received').get(authenticated, receivedMessages)

router
    .route('/:id')
    .get(authenticated, messageSender, getMessage)
    .put(authenticated, messageSender, editMessage)
    .delete(authenticated, messageSender, deleteMessage);


module.exports = router;
