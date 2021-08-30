const express = require('express');
const router = express.Router();
const UserProfile =  require('./model');

const {getUserProfiles, getUserProfile, postUserProfile, editUserProfile,
    deleteUserProfile} = require('./controller')
const { authenticated, hasPermission } = require('../../middleware/auth');


router
    .route('/')
    .get(getUserProfiles, authenticated, hasPermission('admin'))
    .post(authenticated, postUserProfile);

router
    .route('/:id')
    .get(getUserProfile)
    .put(authenticated, editUserProfile)
    .delete(authenticated, deleteUserProfile);


module.exports = router;
