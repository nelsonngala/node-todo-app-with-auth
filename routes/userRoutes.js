const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, forgotPassword, resetPassword } = require('../controllers/authController');

router.route('/register').post(register);
router.get('/user/verify-email', verifyEmail);
router.post('/login', login);
router.get('/forgot-password', forgotPassword);
router.post('/user/reset-password', resetPassword);
module.exports= router;


