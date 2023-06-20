const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


function isStringInvalid(str){
    if(str == undefined || str.length === 0){
        return true
    }
    else{
        return false
    }
}


exports.addUser = async (req, res) => {
    console.log(req.body)
    try{
    const Name = req.body.Name;
    const Email = req.body.Email;
    const Password = req.body.Password;

    if(isStringInvalid(Name) || isStringInvalid(Email) || isStringInvalid(Password)){
        return res.status(400).json({err: "some parameters missing"})
    }

    // const user = await User.findAll({where: {Email: Email}})
    // if(user.Email[0] === Email){
    //     return res.status(400).json({err: "User already Exists"})
    // }
    const saltrounds = 10;
    bcrypt.hash(Password, saltrounds, async(err, hash) => {
        if(err){
            console.log(err);
            throw new Error(err);
        }
        const user = new User({Name, Email, Password: hash})
        await user.save();
        res.status(201).json({message: 'User created successfully'});
    })
    } catch(err){
        res.status(500).json({error: err})
    }
}

function generateAccessToken(id,Name,ispremiumuser) {
    return jwt.sign({userId : id, Name: Name, ispremiumuser},`${process.env.JWT_SECRET_KEY}`)
}
exports.login = async(req, res, next) => {
    try{
        const Email = req.body.Email;
        const Password = req.body.Password;
        if(isStringInvalid(Email) || isStringInvalid(Password)){
            return res.status(400).json({message: 'Email or password is missing'})
        }

        const user = await User.findOne({Email: Email})
        console.log(user);
        if(user){
            bcrypt.compare(Password, user.Password, async(err, result) => {
                if(err){
                    console.log(err);
                }
                if(result === true){
                    res.status(200).json({success: true, message: "User login successful", token: generateAccessToken(user._id, user.Name, user.ispremiumuser)})
                }
                else{
                    res.status(400).json({success: false, message: "Password Incorrect"})
                }
            })
            }
            else{
                res.status(404).json({success: false, message: "User not found"})
            }
        }
     catch(err){
        res.status(500).json({
            error: err 
        })
    }
}