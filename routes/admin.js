const express = require('express');
const router = express.Router({mergeParams: true});
const Admin = require('../models/admin');
// const User = require('../models/user');
const mongoose = require("mongoose");



//New payment route
router.post("/pay/:id", function(req,res){
    let payment = req.body.payments;
    
    Admin.findById(req.params.id, function(err, thisAdmin){
        if(err){
            console.log(err)
        } else{
            payment.date = new Date();
            thisAdmin.payments.push(payment);
            thisAdmin.save();
            console.log(`${thisAdmin.firstName} paid ${payment.amount} on ${payment.date}`)
            // console.log(thisAdmin)
        }
        res.redirect("/Admin/profile/"+thisAdmin._id)
    });
});

//Show Admin profile and balance
router.get("/profile/:id", function(req,res){
    console.log(req.params);
    Admin.findById(req.params.id, function(err, thisAdmin){
        if(err){
            console.log(err)
        } else{
            console.log(thisAdmin)
            if(thisAdmin.payments.length!==0){
              let payments = thisAdmin.payments;
            let balance = thisAdmin.balance;
            balance = 0
            payments.forEach(function(payment){
                balance += payment.amount;
                thisAdmin.balance = balance;
            })  
            }
            
            res.render("Admin/profile", {Admin:thisAdmin})
        }
        // console.log(thisAdmin)
    })
    
});

function isLoggedInAdmin(req,res,next){
if(req.isAuthenticated()){
    return next();
}
res.redirect("/");
}


module.exports = router;