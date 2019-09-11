const mongoose = require ("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

// const User = require("./")
const paymentSchema = new mongoose.Schema({
    amount: Number,
    paymentRef: String,
    date: String,
    payee: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    email: String
    }
});


paymentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Payment', paymentSchema)