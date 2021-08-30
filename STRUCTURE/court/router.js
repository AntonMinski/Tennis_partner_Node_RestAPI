const express = require('express');
const router = express.Router();
const Courts =  require('./model');

const {getCourts, getCourt, postCourt, editCourt, deleteCourt}
= require('./controller')

const { authenticated, hasPermission } = require('../../middleware/auth');

router
    .route('/')
    .get(getCourts)
    .post(authenticated, hasPermission('courtAdmin', 'admin'), postCourt);

router
    .route('/:id')
    .get(getCourt)
    .put(authenticated, hasPermission('courtAdmin', 'admin'), editCourt)
    .delete(authenticated, hasPermission('courtAdmin', 'admin'), deleteCourt);



module.exports = router;
