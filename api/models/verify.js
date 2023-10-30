const mongoose = require("mongoose");

const VerifySchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        max:50,
    },
    otp:{
        type:String,
        require:true,
    },
},{timestamps:true});

module.exports=mongoose.model("Verify",VerifySchema);