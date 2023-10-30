const express = require('express');
const router = express.Router();
const refreshTokenControllers = require('../controllers/refreshToken-controller');

router.get('/', refreshTokenControllers.refreshToken);

module.exports = router;