const express = require('express');
const router = express.Router();
const Message =  require('./model');

const {getMessages, getMessage, postMessage, editMessage, deleteMessage}
= require('./controller')
const { authenticated, hasPermission } = require('../../middleware/auth');


router
    .route('/')
    .get(getMessages)
    .post(authenticated, postMessage);

router
    .route('/:id')
    .get(getMessage)
    .put(authenticated, editMessage)
    .delete(authenticated, deleteMessage);


module.exports = router;
