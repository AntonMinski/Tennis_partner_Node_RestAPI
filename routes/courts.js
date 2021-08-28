const express = require('express');
const router = express.Router();
const Courts =  require('../models/Courts');

const {getCourts, getCourt, postCourt, editCourt, deleteCourt}
= require('../controllers/courts')

const { authenticated, hasPermission } = require('../middleware/auth');

router
    .route('/')
    .get(getCourts)
    .post(authenticated, hasPermission('user', 'admin'), postCourt);

router
    .route('/:id')
    .get(getCourt)
    .put(authenticated, editCourt)
    .delete(authenticated, hasPermission('user', 'admin'), deleteCourt);



module.exports = router;
