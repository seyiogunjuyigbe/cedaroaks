const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const Payment = require("../models/payment");

  
router.get("/new", function(req,res){
    User.findById(req.params.id, function(err,user){
        if(err){
            console.log(err)
        } else{
            res.render("Clients/contributionForm", {user:user})
        }
   })
});

router.post("/new", isLoggedIn, function (req,res){
    
    User.findById(req.params.id, function(err,user){
        if(err){
            console.log(err)
        } else{
            const amount = req.body.amount;
            const ref = req.body.ref;
                      Payment.create({amount:amount, ref:ref}, function(err, payment){
                if(err){
                    console.log(err)
                } else{
                    var now = new Date()
                    payment.date = now.toDateString();
                    payment.payee.id = req.params.id;
                    payment.payee.firstName = user.firstName;
                    payment.payee.lastName = user.lastName;
                    payment.payee.phoneNumber = user.phone;
                    payment.payee.email = user.email;
                    payment.paymentRef = ref;
                    payment.save()
                    user.payments.push(payment);
                    // user.payments.forEach(function(payment){
                    //     if(user.balance == NaN || user.balance == undefined){
                    //         user.balance = 0;
                    //         user.balance += payment.amount;
                    //     } else{
                    //         user.balance += payment.amount;
                    //     }
                    //  })
                    user.save();
                    console.log("payment successful");
                }
                res.redirect(`/user/profile/${user._id}`)
            })  
        }
   })
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
           res.redirect("/user/login"); 
    }
    }


module.exports = router;