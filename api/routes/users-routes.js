const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');
const checkAuth =require('../middleware/check-auth')
const router = express.Router();

//router.use(checkAuth);
router.get('/search/:userName',usersControllers.getUserByUserName);
router.get('/:id',usersControllers.getCurrentUser);
router.patch('/:id',usersControllers.updateUser);
router.delete('/:id',usersControllers.deleteUser);
router.put('/:id',usersControllers.followUser);

router.get('/following/:id',usersControllers.getUserFollowing);
router.get('/suggested/:id',usersControllers.getSuggestedUsers);

module.exports = router;