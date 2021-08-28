const express = require('express');
const router = express.Router();

const User =  require('../models/User');
const {register, login, getUser} = require('../controllers/auth');
const {authenticated} = require('../middleware/auth')

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticated, getUser);

module.exports = router;
