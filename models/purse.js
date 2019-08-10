const mongoose = require ("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const purseSchema = new mongoose.Schema({
    payments: [],
    balance: {type: Number, default: 0},
    loanRequests:[],
    approvedLoans:[],
    paidLoans: []
});
purseSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Purse', purseSchema);