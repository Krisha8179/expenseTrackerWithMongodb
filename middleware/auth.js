const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config()

const authenticate = async (req, res, next) => {
    try{
        const token = req.header('Authorization');
        const userObj = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
        const user = await User.findById(userObj.userId)
        req.user = user;
        next();
    }catch(err){
        console.log(err)
        return res.status(401).json({success: false});
    }
}

module.exports ={
    authenticate
}