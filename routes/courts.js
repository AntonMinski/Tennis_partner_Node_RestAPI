const express = require('express');
const router = express.Router();
const Courts = require('../models/Courts');

const {getCourts, getCourt, postCourt, editCourt, deleteCourt}
= require('../controllers/courts')

router
    .route('/')
    .get(getCourts)
    .post(postCourt);

router
    .route('/:id')
    .get(getCourt)
    .put(editCourt)
    .delete(deleteCourt);



module.exports = router;
