const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
    IsActive: {
        type:Boolean,
    },
    expires: {
        type: Date
    },
    userId:  {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
})

module.exports = mongoose.model('forgotpassword', forgotPasswordSchema);
