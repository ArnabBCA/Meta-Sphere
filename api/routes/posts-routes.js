const express = require('express');
const { check } = require('express-validator');

const postsController = require('../controllers/posts-controller');
const checkAuth=require('../middleware/check-auth')

const router = express.Router();

router.use(checkAuth);

router.post('/',check('desc').isLength({max:50}),postsController.createPost);
router .get('/:id',postsController.getPostById);
router.patch('/:id',[check('desc').isLength({max:50})],postsController.updatePost);
router.delete('/:id',postsController.deletePost);

router.put('/:id/like',postsController.likePost);
router.put('/:id/comment',postsController.commentPost);
router.post('/user/:id',postsController.getPostsByUserId);
router.post('/timeline/:id/all',postsController.timelinePosts);
router.post('/explore',postsController.getAllPosts);

module.exports = router;