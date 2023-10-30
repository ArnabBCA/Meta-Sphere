const jwt = require('jsonwebtoken');
const User = require('../models/user');

const refreshToken = async(req, res) => {

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(401).json({message:"No refresh token provided"});
    const refreshToken = cookies.jwt;
    try {
        const user=await User.findOne({refreshToken:refreshToken});
        if(!user){
            return res.status(403).json({message:"Invalid refresh token"});
        }
        jwt.verify(refreshToken, 'secret', (err, decoded) => {
            if(err || user.email !== decoded.email) return res.status(403).json({message:"Invalid refresh token"});
            const token = jwt.sign({email:user.email},'secret',{expiresIn:"1h"});
            res.json({token:token});
        });
    } catch (err) {
        console.log(err);
    }
};

exports.refreshToken = refreshToken;

