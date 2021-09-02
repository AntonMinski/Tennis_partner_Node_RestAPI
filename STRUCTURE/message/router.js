const express = require('express');
const router = express.Router();

const model = require('./model');
const baseRouter = require('../base_module/base_router');
const { authenticated } = require('../../middleware/auth');
const {getMessage, sentMessages, receivedMessages} = require('./controller')


router.route('/sent').get(authenticated, sentMessages);
router.route('/received').get(authenticated, receivedMessages);
router.route('/:id').get(authenticated, getMessage); // specified first, so it has higher priority on base route same route
router.use('/', baseRouter(model));

module.exports = router;
