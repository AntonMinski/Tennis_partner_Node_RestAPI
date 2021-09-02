const model = require('./model');

const baseRouter = require('../base_module/base_router');

const courtRouter = baseRouter(model);

module.exports = courtRouter;
