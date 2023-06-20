const User = require('../models/User');
const ForgotPassword = require('../models/ForgotPassword');
const Sib = require('sib-api-v3-sdk')
// const uuid = require('uuid');
const bcrypt = require('bcrypt');


require("dotenv").config();
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SIB_API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()


exports.forgotPassword = async (req, res) => {
    try{
        const email = req.body.Email;
        const user = await User.findOne({Email: email});
        if(user){
            // const id = uuid.v4();
            const newforgotpassword = new ForgotPassword({IsActive: true, userId: user._id});
            await newforgotpassword.save();
        const sender = {
            email: `${process.env.SENDER_MAIL}`,
        }
        const receivers = [
            {
                email: email
            },
        ]


    await tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'this is dummy mail',
        textContent:`this is a dummy mail only`,
        htmlContent: `<a href="http://localhost:3000/password/resetPassword/${newforgotpassword._id}">Reset Password</a>`
    })
    return res.status(200).json({message: 'Password link sent to mail ', success: true})
    }
    else{
        throw new Error('user does not exist')
    }

    }catch(err){
        console.log(err);
    }
}

exports.resetPassword = async(req, res) => {
    try{
    const id = req.params.id;
    const forgotPasswordRequest = await ForgotPassword.findOne({_id:id})
    if(forgotPasswordRequest){
        forgotPasswordRequest.IsActive = false;
        await forgotPasswordRequest.save();
        res.status(200).send(`<html>
                                <form action="/password/updatePassword/${id}" method="get">
                                    <label for="newpassword">Enter New password</label>
                                    <input name="newpassword" type="password" required></input>
                                    <button>reset password</button>
                                </form>
                            </html>`)
    res.end()
    }
    }catch(err){
        console.log(err);
    }
}

exports.updatePassword = async(req, res) => {
    try{
        const { newpassword } = req.query;
        console.log('newpassword', newpassword)
        const  resetpasswordid  = req.params.resetPasswordid;
        console.log('resetpasswordid', resetpasswordid)
        const resetpasswordrequest = await ForgotPassword.findOne({_id: resetpasswordid})
        const user = await User.findOne({_id: resetpasswordrequest.userId})
        if (user) {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, async function(err, hash) {
                    if(err){
                        console.log(err);
                        throw new Error(err);
                    }
                    user.Password = hash
                    await user.save();
                    res.status(201).json({message: 'updated the password'})
                })
            })
            
        }
        else{
            return res.status(404).json({error: 'user not exists'})
        }
    }catch(err){
        console.log(err);
    }
}
