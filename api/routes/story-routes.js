const express = require('express');
const { check } = require('express-validator');

const storyControllers = require('../controllers/story-controllers');
const checkAuth=require('../middleware/check-auth')

const router = express.Router();

//router.use(checkAuth);

router.post('/',[check('desc').isLength({max:50})],storyControllers.createStory);
router.post('/timeline/:id/all',storyControllers.timelineStories);
router.put('/:id/seen',storyControllers.seenStory);

module.exports = router;