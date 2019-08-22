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
        amount:Number,
        date:String
    }],
    loanRequests:[{
        amount: Number,
        dateApplied: String,
        duration: Number,
        paybackAmount: Number,
        rate: Number,
        dueDate: {type: String, default: ""},
        guarantor1ID: String,
        guarantor1Username: String,
        guarantor2ID: String,
        guarantor2Username: String,
    }],
    approvedLoans:[
        {
            id: String,
            amount: Number,
            paybackAmount: Number,

        }],
    guarantorRequests:[
        {
            requestorId: String,
            requestorUsername:String,
            requestAmount: Number,
            requestDate: String,
            requestDueDate: String,
            requestPaybackAmount: Number
            
    }],
    balance: {type: Number},
    category: String
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);