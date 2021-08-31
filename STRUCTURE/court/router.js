const express = require('express');
const router = express.Router();
const Courts =  require('./model');

const {getCourts, getCourt, postCourt, editCourt, deleteCourt}
= require('./controller')

const { authenticated, hasPermission, courtAdmin, CourtAdmin2} =
    require('../../middleware/auth');

router
    .route('/')
    .get(getCourts)
    .post(authenticated, hasPermission('courtAdmin', 'admin'), postCourt);

router
    .route('/:id')
    .get(getCourt)
    .put(authenticated, CourtAdmin2, editCourt)
    .delete(authenticated, courtAdmin, deleteCourt);



module.exports = router;
