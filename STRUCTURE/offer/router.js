const express = require('express');
const router = express.Router();

const {getOffers, getOffer, postOffer, editOffer, deleteOffer}
= require('./controller')

// Set authorization permissions:
const { authenticated } = require('../../middleware/auth');

//use:

router
    .route('/')
    .get(getOffers)
    .post(authenticated, postOffer);

router
    .route('/:id')
    .get(getOffer)
    .put(authenticated, editOffer)
    .delete(authenticated, deleteOffer);



module.exports = router;
