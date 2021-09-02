const express = require('express');
const router = express.Router();

const User =  require('./model');
const {register, login, logout, getUser, forgotPassword, resetPassword,
    updateUser, updatePassword} =
    require('./controller');
const {authenticated} = require('../../middleware/auth')

router.post('/register', register);
router.post('/login', login);
router.get('/logout',authenticated, logout);
router.get('/user', authenticated, getUser);
router.post('/forgot_password', forgotPassword);
router.put('/reset_password/:resettoken', resetPassword);
router.put('/update_user', authenticated, updateUser);
router.put('/update_password', authenticated, updatePassword);

module.exports = router;
