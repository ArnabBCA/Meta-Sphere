const express = require('express');
const { check } = require('express-validator');
const authControllers = require('../controllers/auth-controllers');

const router = express.Router();

router.post('/signup',[
    check('userName').not().isEmpty(),
    check('fullName').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})
], authControllers.signup);

router.post('/login', authControllers.login);
router.post('/sendotp', authControllers.sendEmailOtp);
router.post('/verify', authControllers.verifyEmail);

module.exports = router;