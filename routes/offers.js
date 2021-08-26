const express = require('express');
const router = express.Router();

const {getOffers, getOffer, postOffer, editOffer, deleteOffer}
= require('../controllers/offers')

router
    .route('/')
    .get(getOffers)
    .post(postOffer);

router
    .route('/:id')
    .get(getOffer)
    .put(editOffer)
    .delete(deleteOffer);



module.exports = router;
