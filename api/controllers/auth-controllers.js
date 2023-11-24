const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');
const Verify = require('../models/verify');
const cloudinary = require('../middleware/cloudinary');

// Register a new user
const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Invalid inputs passed, please check your data.' });
    }
    try {
        // Check if email or username already exists
        const uniqueEmail = await User.findOne({ email: req.body.email });
        if (uniqueEmail) {
            return res.status(422).json({ message: 'Email already exists.' });
        }
        const uniqueUserName = await User.findOne({ userName: req.body.userName });
        if (uniqueUserName) {
            return res.status(422).json({ message: 'User name already taken.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const createdUser = new User({
            userName: req.body.userName,
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
        });

        const user = await createdUser.save();

        if(req.body.profilePicture){
            const result = await cloudinary.uploader.upload(req.body.profilePicture, {
                folder: `Meta_Sphere/${user._id.toString()}`,
                quality: 'auto',
                height: 100,
                width: 100,
                public_id: user._id.toString(),
            });
    
            const imageInfo = {
                public_id: result.public_id,
                url: result.secure_url,
            };
    
            req.body.profilePicture = imageInfo;
            await User.findByIdAndUpdate(user._id.toString(), {
                profilePicture: req.body.profilePicture,
            });
        }
        //res.status(201).json({ message: 'User created!'});
        //send otp to email
        await sendEmailOtp(req,res);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Signing up failed, please try again.' });
    }
};


// Login a user
const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(401).json({ message: 'Invalid credentials, could not log you in.' });
        }
        if(!user.verified){
            return res.status(401).json({ message: 'Email not Verified' });
        }
        const validPassword = await bcrypt.compare(password,user.password);
        if(validPassword){
            const { password, ...userWithoutPassword } = user._doc;
            const token=jwt.sign({email:user.email},'secret',{expiresIn:"1h"});
            const refreshToken=jwt.sign({email:user.email},'secret',{expiresIn:"1d"});

            await user.updateOne({refreshToken:refreshToken});
            res.cookie('jwt',refreshToken,{httpOnly:true ,secure:true, maxAge: 24*60*60*1000});
            res.status(200).json({currentUser:userWithoutPassword,token:token});
        }
        else{
            return res.status(401).json({ message: 'Invalid credentials, could not log you in.' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Logging in failed, please try again.' });
    }
}

// Logout a user
const logout = async(req, res) => {
    try {
        const userId=req.body.userId;
        const user=await User.findById(userId);
        await user.updateOne({refreshToken:""});
        user.save();
        res.clearCookie('jwt',{httpOnly:true,secure:true});
        res.status(200).json({ message: 'Logged out' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Logging out failed, please try again.' });
    }
};

//send email otp
const sendEmailOtp=async (req, res) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000);
        
        const haveOTP=await Verify.findOne({email:req.body.email});
        if(haveOTP){
            await haveOTP.updateOne({otp:otp});
        }
        else{
            const verifyEmail = new Verify({
                email: req.body.email,
                otp: otp,
            });
            await verifyEmail.save();
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });
        const info = await transporter.sendMail({
            from: process.env.EMAIL, // sender address
            to: req.body.email, // list of receivers
            subject: "OTP for email verification", // Subject line
            text: "Your One Time OTP is", // plain text body
            html: `<b>${otp}</b>`, // html body
        });
        return res.status(200).json({ message: 'Verification Email Send' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Failed to send Email OTP.' });
    }
};

//email verification
const verifyEmail=async (req, res) => {
    try {
        const UserOTP=await Verify.findOne({email:req.body.email});
        if(!UserOTP){
            return res.status(401).json({ message: 'Invalid OTP' });
        }
        if(UserOTP.otp===req.body.otp){
            const user=await User.findOne({email:req.body.email});
            await user.updateOne({verified:true});
            await UserOTP.deleteOne();
            return res.status(200).json({ message: 'Otp Verified' });
        }
        else{
            return res.status(401).json({ message: 'Invalid OTP' });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.sendEmailOtp=sendEmailOtp;
exports.verifyEmail=verifyEmail;