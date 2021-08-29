const express = require('express');
const router = express.Router();
const Courts =  require('../models/Courts');

const {getCourts, getCourt, postCourt, editCourt, deleteCourt}
= require('../controllers/courts')

const { authenticated, hasPermission } = require('../middleware/auth');

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
