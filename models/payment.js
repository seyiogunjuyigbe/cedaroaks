const mongoose = require ("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const User = require("./")
const paymentSchema = new mongoose.Schema({
    amount: Number,
    date: String,
    payee: {
        type:mongoose.Schema.Types.ObjectId,
        ref: User
    }
});

module.exports = mongoose.model('payment', paymentSchema)