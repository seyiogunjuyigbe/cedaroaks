const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const mongoose = require("mongoose");


//New payment route
router.post("/pay/:id", function(req,res){
    let payment = req.body.payments;
    
    User.findById(req.params.id, function(err, thisUser){
        if(err){
            console.log(err)
        } else{
            payment.date = new Date();
            thisUser.payments.push(payment);
            thisUser.save();
            console.log(`${thisUser.firstName} paid ${payment.amount} on ${payment.date}`)
            // console.log(thisUser)
        }
        res.redirect("/user/profile/"+thisUser._id)
    });
});

//Show User profile and balance
router.get("/profile/:id", function(req,res){
    User.findById(req.params.id, function(err, thisUser){
        if(err){
            console.log(err)
        } else{
            let payments = thisUser.payments;
            let balance = thisUser.balance;
            balance = 0
            payments.forEach(function(payment){
                balance += payment.amount;
                thisUser.balance = balance;
            })
            res.render("Clients/profile", {User:thisUser})
        }
        // console.log(thisUser)
    })
    
});






module.exports = router;