const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    creatorId:{
        type:String,
        required:true
    },
    isSeenBy:{
        type:Array,
        default:[]
    },
    desc:{
        type:String,
        max:50
    },
    gradient: {
        color1: {
            type: String,
        },
        color2: {
            type: String,
        },
    },
    image:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        },
    },
    expireAt: {
        type: Date,
        default: Date.now(),
        index: { expires: '86400s' }
    }
},{timestamps:true});

module.exports = mongoose.model('Story',storySchema);