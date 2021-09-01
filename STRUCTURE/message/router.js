const express = require('express');
const router = express.Router();
const model = require('./model');

const { authenticated } = require('../../middleware/auth');

const {getMessage, sentMessages, receivedMessages} = require('./controller')

const baseRouter = require('../base_module/base_router');

// router.route('/:id').get(authenticated, getMessage);
router.route('/sent').get(authenticated, sentMessages);
router.route('/received').get(authenticated, receivedMessages);
router.route('/:id').get(authenticated, getMessage);
router.use('/', baseRouter(model));


module.exports = router;
