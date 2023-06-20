const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    ispremiumuser: {
        type: String
    },
    totalCost: {
        type: Number,
        default: 0
    }
    
});

module.exports = mongoose.model('User', userSchema);
