const mongoose = require ("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

//Schema Set Up
//user schema setup
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: Number,
    username: String,
    password: String,
    payments: [{
     amount: Number,
     date: String  
    }],
    balance: {type: Number, default:0},
    category: String
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);