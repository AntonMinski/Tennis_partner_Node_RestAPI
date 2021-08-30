const express = require('express');
const router = express.Router();
const UserProfile =  require('./model');

const {getUserProfiles, getOwnProfile, postUserProfile, editUserProfile,
    deleteUserProfile} = require('./controller')
const { authenticated, hasPermission, profileOwner, alreadyHasProfile} =
    require('../../middleware/auth');


router
    .route('/all')
    .get(authenticated, hasPermission('admin'), getUserProfiles);


router
    .route('/')
    .get(authenticated, profileOwner, getOwnProfile)
    .post(authenticated, alreadyHasProfile, postUserProfile)
    .put(authenticated, profileOwner, editUserProfile)
    .delete(authenticated, profileOwner, deleteUserProfile);


module.exports = router;
