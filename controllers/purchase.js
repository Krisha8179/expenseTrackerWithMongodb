const Razorpay = require('razorpay');
const Order = require('../models/Order');
require("dotenv").config();
userController = require('../controllers/user');
const jwt = require('jsonwebtoken')

const purchasepremium = async (req, res) => {
    try{
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
        
        rzp.orders.create({amount, currency: 'INR'}, (err, order) => {
            if(err){
                console.log(err);
                throw new Error(JSON.stringify(err));
            }
            const neworder = new Order({orderid: order.id, status: 'PENDING', userId: req.user})
            neworder.save().then(() => {
                return res.status(201).json({order, key_id: rzp.key_id});
            }).catch(err => {
                throw new Error(err);
            })
        })

    } catch(err){
        console.log(err)
        res.status(403).json({ message: 'something went wrong', error:err})
    }
}

function generateAccessToken(id,ispremiumuser) {
    return jwt.sign({userId : id, ispremiumuser},`${process.env.JWT_SECRET_KEY}`)
}

const updateTransactionStatus = async(req, res) => {
    try{
        const payment_id = req.body.payment_id;
        const order_id = req.body.order_id;
        const order = await Order.findOne({orderid : order_id})
        order.paymentid = payment_id;
        order.status = 'SUCCESSFUL';
        const promise1 = await order.save();
        req.user.ispremiumuser = true;
        const promise2 = await req.user.save();

        Promise.all([promise1, promise2]).then(()=>{
            return res.status(202).json({success: true, message: "Transaction successfull", token: generateAccessToken(order.userId, true)})
        }).catch((error) => {
            throw new Error(error)
        })
        
    }catch(err){
        console.log(err);
        res.status(403).json({error: err, message: 'something went wrong'})
    }
}

module.exports = {
    updateTransactionStatus,
    purchasepremium
}