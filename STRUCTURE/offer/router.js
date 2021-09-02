const model = require('./model');

const baseRouter = require('../base_module/base_router');

const offerRouter = baseRouter(model);

module.exports = offerRouter;
