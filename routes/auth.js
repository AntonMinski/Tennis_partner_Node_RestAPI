const express = require('express');
const router = express.Router();

const User =  require('../models/User');
const {register, login, getUser, forgotPassword, resetPassword,
    updateUser, updatePassword} =
    require('../controllers/auth');
const {authenticated} = require('../middleware/auth')

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticated, getUser);
router.post('/forgot_password', forgotPassword);
router.put('/reset_password/:resettoken', resetPassword);
router.put('/update_user', authenticated, updateUser);
router.put('/update_password', authenticated, updatePassword);

module.exports = router;
