const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Story = require('../models/story');
const User = require('../models/user');
const cloudinary = require('../middleware/cloudinary');

//create a story
const createStory = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    }
    const { image, creatorId, desc, color1, color2 } = req.body;
    try {
        const existingStories = await Story.find({ creatorId: creatorId }); //check if user has already created a story
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
        const newStory = new Story({
            gradient: {
                color1: color1,
                color2: color2,
            },
            image: imageInfo,
            creatorId: creatorId,
            desc: desc || null,
            expireAt: new Date(Date.now() + 60 * 1000),
        });

        const saveStory = await newStory.save();
        const currentUser = await User.findById(creatorId);

        let currentUserStory=null;
        if (existingStories.length > 0) {        //if user has already created a story
            currentUserStory = {
                ...saveStory.toObject(),
            };
        }
        else {                                 //if user has not created a story
            currentUserStory = {
                userName: currentUser.userName,
                fullName: currentUser.fullName,
                profilePicture: currentUser.profilePicture.url,
                location: currentUser.location,
                storySlides: [saveStory.toObject()],
            };
        }
        res.status(200).json(currentUserStory);
    } catch (err) {
        console.log(err);
        const error = new HttpError('Creating post failed, please try again.', 500);
        return next(error);
    }
};


//get timeline stories
const timelineStories = async (req, res, next) => {
    try {
        const page=req.query.page;
        const limit=req.query.limit;
        
        const startIndex=(page-1)*limit;
        const endIndex=page*limit;

        const storiesIds=req.body.storiesIds; //array of storiesIds of already fetched stories

        const currentUser=await User.findById(req.params.id);

        //Logged User Stories
        const stories = await Story.find({ creatorId: req.params.id });
        var currentUserStories = [
            {
                userId:req.params.id,
                userName: currentUser.userName,
                fullName: currentUser.fullName,
                profilePicture: currentUser.profilePicture.url,
                location: currentUser.location,
                storySlides: stories.map(story => ({
                ...story.toObject(),
                })),
            },
        ];
        currentUserStories=currentUserStories.filter(user => user.storySlides.length > 0)

        //Logged User's Following Users Stories
        var followingUsersStory = await Promise.all(
            currentUser.following.map(async (followingId) => {
              const followingUser = await User.findById(followingId);
              const followingUserStories = await Story.find({ creatorId: followingId });
              return {
                userId:followingId,
                userName: followingUser.userName,
                fullName: followingUser.fullName,
                profilePicture: followingUser.profilePicture.url,
                location: followingUser.location,
                storySlides: followingUserStories.map(story => ({
                  ...story.toObject(),
                })),
              };
            })
        );
        followingUsersStory=followingUsersStory.filter(user => user.storySlides.length > 0)

        let storiesMoveToFront = followingUsersStory.filter((story) => storiesIds.includes(story.userId));
        let storiesMoveToBack = followingUsersStory.filter((story) => !storiesIds.includes(story.userId));

        //Sorting the storiesMoveToBack users stories lastest to oldest
        storiesMoveToBack=storiesMoveToBack.sort((a, b) => {
            const lastStoryA = a.storySlides[a.storySlides.length - 1];
            const lastStoryB = b.storySlides[b.storySlides.length - 1];
            return lastStoryB.createdAt - lastStoryA.createdAt;
        });
        
        //Merging Logged User and Following Users Stories
        let mergedTimelineStories = currentUserStories.concat(...storiesMoveToFront).concat(...storiesMoveToBack);
        
        res.status(200).json(mergedTimelineStories.slice(startIndex,endIndex));
    } catch (err) {
        console.log(err)
        const error = new HttpError('Fetching timeline posts failed, please try again later.', 500);
        return next(error);
    }
};

//seen story
const seenStory=async(req,res,next)=>{
    try {
        const story=await Story.findById(req.params.id);
        if ( story && !story.isSeenBy.includes(req.body.userId)) {
            await story.updateOne({$push:{isSeenBy:req.body.userId}});
            await story.save();
            res.status(200).json("Just Seen");
        }
        else{
            res.status(200).json("Already Seen");
        }
    } catch (err) {
        console.log(err)
        const error = new HttpError('Unable to make Story Seen', 500);
        return next(error);
    }
};

exports.createStory = createStory;
exports.timelineStories = timelineStories;
exports.seenStory = seenStory;