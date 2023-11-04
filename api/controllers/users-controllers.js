const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const bcrypt=require("bcrypt");
const cloudinary = require('../middleware/cloudinary');

const User = require('../models/user');
//Get current user
const getCurrentUser=async(req,res,next)=>{
    try {
        const user=await User.findById(req.params.id);
        if(!user){
            const error= new HttpError('User not found.', 404);
            return next(error);
        }
        res.status(200).json(user);
    } catch (err) {
        const error = new HttpError('Could not get user.',500);
        return next(error);
    }
};

//get users by userName
const getUserByUserName=async(req,res,next)=>{
    try {
        const users = await User.find({ userName: { $regex: req.params.userName, $options: 'i' }})
            .select('_id userName fullName profilePicture');
        if(!users){
            const error= new HttpError('User not found.', 404);
            return next(error);
        }
        const mappedUsers = users.map(user => {
            return {
                userName: user.userName,
                fullName: user.fullName,
                profilePicture: user.profilePicture.url,
            };
        });
        res.status(200).json(mappedUsers);

    } catch (err) {
        console.log(err);
        const error = new HttpError('Failed to get user.',500);
        return next(error);
    }
};


//Update a user
const updateUser=async(req,res,next)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        let imageInfo = null;
        if (req.body.profilePicture) {
            //console.log(req.body.profilePicture);
            try {
                const result = await cloudinary.uploader.upload(req.body.profilePicture, {
                    folder: `Meta_Sphere/${req.body.userId}`,
                    public_id: req.body.userId,
                });
                imageInfo = {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
                req.body.profilePicture=imageInfo;

            } catch (err) {
                const error = new HttpError('Could not update user.',500);
                return next(error);
            }
        }
        if(req.body.password){
            try {
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);
            } catch (err) {
                const error = new HttpError('Could not update user.',500);
                return next(error);
            }
        }
        try{
            await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            });
            const updatedUser=await User.findById(req.params.id);
            res.status(200).json(updatedUser);
        }catch(err){
            const error = new HttpError('Could not update user.',500);
            return next(error);
        }
    }
    else{
        const error = new HttpError('You can update only your account.',403);
        return next(error);
    }
};

//Delete a user
const deleteUser=async(req,res,next)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        }catch(err){
            const error = new HttpError('Could not delete user.',500);
            return next(error);
        }
    }
    else{
        const error = new HttpError('You can delete only your account.',403);
        return next(error);
    }
};

//Follow or Unfollow a user
const followUser=async(req,res,next)=>{
    if(req.body.userId!==req.params.id){
        try {    //User Follow
            const otherUser=await User.findById(req.params.id);
            const currentUser= await User.findById(req.body.userId);
            if(otherUser.followers.includes(req.body.userId)){
                await otherUser.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{following:req.params.id}});

                const updatedCurrentUser= await User.findById(req.body.userId);
                res.status(200).json(updatedCurrentUser);
            }   
            else{  //User Unfollow
                await otherUser.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{following:req.params.id}});
                
                const updatedCurrentUser= await User.findById(req.body.userId);
                res.status(200).json(updatedCurrentUser);
            }
        } catch (err) {
            console.log(err);
            const error = new HttpError('Could not follow or Unfollow a user.',500);
            return next(error);
        }
    }
    else{
        const error = new HttpError('You cannot follow yourself.',403);
        return next(error);
    }
};
//get a user all Followings
const getUserFollowing=async(req,res,next)=>{
    try {
        const page=req.query.page;
        const limit=req.query.limit;
        
        const startIndex=(page-1)*limit;
        const endIndex=page*limit;

        const user=await User.findById(req.params.id);
        const followingUsers = await Promise.all(
            user.following.map(async(followingId) => {
                const followingUser = await User.findById(followingId);
                return {
                    userId: followingUser._id,
                    userName: followingUser.userName,
                    fullName: followingUser.fullName,
                    profilePicture: followingUser.profilePicture.url,
                    location: followingUser.location
                };
            })
        );
        res.status(200).json(followingUsers.slice(startIndex,endIndex));
    } catch (err) {
        const error = new HttpError('Failed to fetch all following Users',404);
        return next(error);
    }
};

//get suggested users
const getSuggestedUsers=async(req,res,next)=>{
    try {
        const page=req.query.page;
        const limit=req.query.limit;
        
        const startIndex=(page-1)*limit;
        const endIndex=page*limit;

        const user=await User.findById(req.params.id);
        const followingUsers = user.following;

        const suggestedUsers = await User.find(
            {
                _id: { $nin: followingUsers },
            },
            // Projection object to specify fields to retrieve
            '_id userName fullName location profilePicture'
        );

        res.status(200).json(suggestedUsers.slice(startIndex,endIndex));
    } catch (err) {
        console.log(err);
        const error = new HttpError('Failed to fetch Suggested User Users',404);
        return next(error);
    }
};    

exports.getUserByUserName=getUserByUserName;
exports.getCurrentUser=getCurrentUser;
exports.updateUser=updateUser;
exports.deleteUser=deleteUser;
exports.followUser=followUser;

exports.getUserFollowing=getUserFollowing;
exports.getSuggestedUsers=getSuggestedUsers;