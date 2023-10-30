const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Post = require('../models/post');
const User = require('../models/user');
const cloudinary = require('../middleware/cloudinary');

//create a post
const createPost=async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error= new HttpError('Invalid inputs passed, please check your data.',422);
        return next(error);
    }
    const {image,creatorId,desc}=req.body;
    try {
        let imageInfo = null;
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: `Meta_Sphere/${creatorId}/Images`,
            });
            imageInfo = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }
        const newPost = new Post({
            image:imageInfo,
            creatorId:creatorId,
            desc:desc || null,
        });

        const savePost=await newPost.save();
        const currentUser=await User.findById(creatorId);

        const currentUserPost = {
            ...savePost.toObject(),
            userName: currentUser.userName,
            fullName: currentUser.fullName,
            profilePicture: currentUser.profilePicture.url,
            location: currentUser.location
        };
        res.status(200).json(currentUserPost);

    } catch (err) {
        console.log(err);
        const error = new HttpError('Creating post failed, please try again.',500);
        return next(error);
    }
};

//get a post by Id
const getPostById=async(req,res,next)=>{
    let post;
    try {
        post=await Post.findById(req.params.id);
    } catch (err) {
        const error = new HttpError('Could not find the post by that Id',404);
        return next(error);
    }
    res.status(200).json({post:post.toObject({getters:true})});
};

// update a post
const updatePost=async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error=new HttpError('Invalid inputs passed,please check your data.',422);
        return next(error);
    }
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            const error=new HttpError('Could not find the post by that Id',404);
            return next(error);
        }
        if(post.creatorId===req.body.userId){
            const {image}=req.body;
            if(image){
                const uploadOptions = {
                    folder: `Meta_Sphere/${post.creatorId}/Images`,
                };
                if (post.image && post.image.public_id) {
                    uploadOptions.public_id = post.image.public_id.split('/').pop();
                }
                const result = await cloudinary.uploader.upload(image, uploadOptions);
                imageInfo = {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
                req.body.image=imageInfo;
            }

            await post.updateOne({$set:req.body});
            const findUpdatedPost=await Post.findById(req.params.id);
            const updatedComments = await Promise.all(findUpdatedPost.comments.map(async (comment) => {
                const user = await User.findById(comment.userId);
                return {
                    ...comment.toObject(),
                    profilePicture: user.profilePicture.url,
                    userName: user.username,
                 };
            }));
            const postCreator=await User.findById(post.creatorId);
            const updatePost = {
                ...findUpdatedPost.toObject(),
                username: postCreator.username,
                profilePicture: postCreator.profilePicture.url,
                location: postCreator.location,
                comments: updatedComments,
            };
            res.status(200).json(updatePost);
        }
        else{
            const error = new HttpError('You can Update only your post.',403);
            return next(error);
        }
    } catch (err) {
        console.log(err);
        const error = new HttpError('Something went wrong, could not update post.',500);
        return next(error);
    }
};
//  delete a post
const deletePost=async(req,res,next)=>{
    let post;
    try {
        post=await Post.findById(req.params.id);
        if(!post){
            const error=new HttpError('Could not find the post by that Id',404);
            return next(error);
        }
        if(post.creatorId===req.body.userId){
            if(post.image.public_id){
                await cloudinary.uploader.destroy(post.image.public_id);
            }
            await post.deleteOne();
            res.status(200).json("Post Deleted");
        }
        else{
            const error = new HttpError('You can Delete only your post.',403);
            return next(error);
        }
    }catch(err){
        const error= new HttpError('Could not delete post.',500);
        return next(error);
    }
};


// Like/Dislike a post
const likePost=async(req,res,next)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            const error=new HttpError('Could not find the post by that Id',404);
            return next(error);
        }
        if(post.likes.includes(req.body.userId)){
            await post.updateOne({$pull:{likes:req.body.userId}});
        }
        else{
            await post.updateOne({$push:{likes:req.body.userId}});
        }

        const findUpdatedPost=await Post.findById(req.params.id);
        const updatedComments = await Promise.all(findUpdatedPost.comments.map(async (comment) => {
            const user = await User.findById(comment.userId);
            return {
                ...comment.toObject(),
                profilePicture: user.profilePicture.url,
                userName: user.username,
            };
        }));

        const postCreator=await User.findById(post.creatorId);
        const updatePost = {
            ...findUpdatedPost.toObject(),
            username: postCreator.username,
            profilePicture: postCreator.profilePicture.url,
            location: postCreator.location,
            comments: updatedComments,
        };
        res.status(200).json(updatePost);
    } catch (err) {
        const error = new HttpError('Failed to like or dislike the post',500);
        return next(error);
    }
};

// Comment on a post

const commentPost=async(req,res,next)=>{
    let post;
    try {
        post=await Post.findById(req.params.id);
        if(!post){
            const error=new HttpError('Could not find the post by that Id',404);
            return next(error);
        }
        await post.updateOne({
            $push: {
              comments: {
                userId: req.body.userId,
                text: req.body.text,
              }
            }
        });

        const findUpdatedPost=await Post.findById(req.params.id);

        const updatedComments = await Promise.all(findUpdatedPost.comments.map(async (comment) => {
            const user = await User.findById(comment.userId);
            return {
                ...comment.toObject(),
                profilePicture: user.profilePicture.url,
                userName: user.username,
            };
        }));

        const postCreator=await User.findById(post.creatorId);
        const updatePost = {
            ...findUpdatedPost.toObject(),
            username: postCreator.username,
            profilePicture: postCreator.profilePicture.url,
            location: postCreator.location,
            comments: updatedComments,
        };
        res.status(200).json(updatePost);
    } catch (err) {
        const error = new HttpError('Failed to comment on the post',500);
        return next(error);
    }
};

// get all posts of user
const getPostsByUserId=async(req,res,next)=>{
    let posts;
    try {
        posts=await Post.find({creatorId:req.params.id});
        if(!posts || posts.length === 0){
            return next(new HttpError('Could not find posts for the provided user id.',404));
        }
        res.status(200).json(posts);
    } catch (err) {
        const error= new HttpError('Fetching posts failed, please try again later.',500);
        return next(error);
    }
};

/*// get timeline posts
const timelinePosts = async (req, res, next) => {
    let posts;
    try {
        const currentUser=await User.findById(req.params.id);
        posts = await Post.find({ creatorId: req.params.id });
        const followingUsersPost = await Promise.all(
            currentUser.following.map((followingId) => {
                return Post.find({ creatorId: followingId });
            })
        );
        res.status(200).json(posts.concat(...followingUsersPost));
    } catch (err) {
        const error = new HttpError('Fetching timeline posts failed, please try again later.', 500);
        return next(error);
    }
};*/


const timelinePosts = async (req, res, next) => {
    let posts;
    try {
        const page=req.query.page;
        const limit=req.query.limit;
        
        const startIndex=(page-1)*limit;
        const endIndex=page*limit;

        const currentUser=await User.findById(req.params.id);

        //Logged User Posts
        posts = await Post.find({ creatorId: req.params.id });
        const currentUserPosts = posts.map(post => ({
            ...post.toObject(),
            userName: currentUser.userName,
            fullName: currentUser.fullName,
            profilePicture: currentUser.profilePicture.url,
            location: currentUser.location
        }));

        //Logged User's Following Users Posts
        const followingUsersPost = await Promise.all(
            currentUser.following.map(async(followingId) => {
                const followingUser = await User.findById(followingId);
                const followingUserPosts = await Post.find({ creatorId: followingId });

                return followingUserPosts.map(post => ({
                    ...post.toObject(),
                    userName: followingUser.userName,
                    fullName: followingUser.fullName,
                    profilePicture: followingUser.profilePicture.url,
                    location: followingUser.location
                }));
            })
        );
        
        //Merging Logged User and Following Users Posts
        let mergedTimelinePosts = currentUserPosts.concat(...followingUsersPost)

        //Updating Comments with their respective userId to the Merged Posts
        mergedTimelinePosts = await Promise.all(mergedTimelinePosts.map(async (post) => {
            const updatedComments = await Promise.all(post.comments.map(async (comment) => {
                const user = await User.findById(comment.userId);
                return {
                    ...comment,
                    profilePicture: user.profilePicture.url,
                    userName: user.userName,
                };
            }));
            return {
                ...post,
                comments: updatedComments
            };
        }));

        //Sorting the Merged Posts by createdAt (lastest to oldest)
        const timelinePosts = mergedTimelinePosts.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        const resultPosts=timelinePosts.slice(startIndex,endIndex);

        res.status(200).json(resultPosts);
    } catch (err) {
        const error = new HttpError('Fetching timeline posts failed, please try again later.', 500);
        return next(error);
    }
};

exports.createPost = createPost;
exports.getPostById = getPostById;
exports.updatePost = updatePost;
exports.deletePost = deletePost;

exports.likePost = likePost;
exports.commentPost = commentPost;
exports.getPostsByUserId = getPostsByUserId;
exports.timelinePosts = timelinePosts;
/*const getPostById=async(req,res,next)=>{
    const postId = req.params.pid;
    let post;
    try {
        post= await Post.findById(postId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a post.',500);
        return next(error);
    }
    if(!post){
        const error= new HttpError('Could not find a post for the provided id.',404);
        return next(error);
    }
    res.json({post});
};*/

/*const getPostsByUserId=async(req,res,next)=>{
    const userId = req.params.uid;
    let posts;
    try {
        posts=Post.find({creatorId:userId});
    } catch (err) {
        const error= new HttpError('Fetching posts failed,please try again later.',500);
        return next(error);
    }
    
    if(!posts || posts.length === 0){
        return next(new HttpError('Could not find posts for the provided user id.',404));
    }
    res.json({posts});
};*/


/*const createPost=async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed,please check your data.',422);
    }
    const {desc,image,creatorId,likes,comments} = req.body;
    const createdPost = new Post({
        creatorId,
        desc,
        image,
        likes,
        comments,
    });
    try {
        await createdPost.save();
    } catch (err) {
        const error = new HttpError('Creating post failed,please try again.',500);
        return next(error);
    }
    res.status(201).json({post:createdPost});
};*/

/*const updatePost=async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed,please check your data.',422);
    }
    const {desc,image} = req.body;
    const postId = req.params.pid;

    let post;
    try {
        post=await Post.findById(postId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update post.',500);
        return next(error);
    }

    post.desc = desc;
    post.image = image;

    try {
        await post.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update post.',500);
        return next(error);
    }

    res.status(200).json({post:post.toObject({getters:true})});
};*/

/*const deletePost=async(req,res,next)=>{
    const postId = req.params.pid;
    let post;
    try {
        post=Post.findById(postId);
    } catch (err) {
        const error= new HttpError('Something went wrong, could not delete post.',500);
        return next(error);
    }
    try{
        await post.remove();
    }catch(err){
        const error= new HttpError('Something went wrong, could not delete post.',500);
        return next(error);
    }
    res.status(200).json({message:'Deleted post.'});
};*/

