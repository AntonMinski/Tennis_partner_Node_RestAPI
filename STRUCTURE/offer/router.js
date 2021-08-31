const express = require('express');
const router = express.Router();
const model = require('./model');
const modelName = 'Offer';

const {getOffers, getOffer, postOffer, editOffer, deleteOffer}
= require('./controller')

// Set authorization permissions:
const { authenticated } = require('../../middleware/auth');
// Set permissions:
const { objectOwner } = require('../../middleware/modelAuth');

//use:
router
    .route('/')
    .get(authenticated, getOffers)
    .post(authenticated, postOffer);

router
    .route('/:id')
    .get(getOffer)
    .put(authenticated, objectOwner(model, modelName), editOffer)
    .delete(authenticated, objectOwner(model, modelName), deleteOffer);


module.exports = router;
