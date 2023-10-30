const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    creatorId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max:50
    },
    image:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        },
    },
    likes:{
        type:Array,
        default:[]
    },
    comments: [
        {
          userId: {
            type: String,
            required: true,
          },
          text: {
            type: String,
            max: 50,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
    ],
},{timestamps:true});

module.exports = mongoose.model('Post',postSchema);